const { mkdirSync, readdirSync, renameSync, statSync } = require("fs")
const { extname } = require("path")
const { alerts } = require("/web/photo/electron/plugins/alerts")

// 날짜 양식 함수
function func(todayDate) {
    const setDate = {
        year: todayDate.getFullYear(),
        month: Number(todayDate.getMonth()) + 1,
        date: todayDate.getDate(),
        hour: todayDate.getHours(),
        minute: todayDate.getMinutes(),
        second: todayDate.getSeconds()
    }

    return setDate.year +
      "-" +
      ("00" + setDate.month.toString()).slice(-2) +
      "-" +
      ("00" + setDate.date.toString()).slice(-2)
}

// 날짜별 정리 함수
function sortByDateFunc(filePath) {
    // 기존 날짜와 비교
    let beforeDate = "2022-01-01"
    let count = 0

    // 새로 작업 할 때, 기존 로그 제거
    const logSelector = document.getElementById("logsContents")
    const lastWorkSelector = document.getElementById("lastWorkAlert")

    if (!!document.querySelector("#logsContents li")) {
        logSelector.replaceChildren()
        lastWorkSelector.replaceChildren()
    } else if (!!document.querySelector("#lastWorkAlert p")) {
        lastWorkSelector.replaceChildren()
    }

    // 핵심 기능
    function fileMove(oldPath, newPath, fileName) {

        try {
            renameSync(oldPath, newPath)
        } catch (err) {
            if (err.message.slice(0, 5) === "EBUSY") {
                alerts("noFiles")
            }
        }

        const li = document.createElement("li")
        // png: 갈색(#bf7d43), jpg: 파란색(#a1acff), arw: 하얀색(#ffffff), dng: 초록색(#93ff8d), 기타: 노란색(#fffa2f)
        if (fileName.slice(fileName.length - 3) === "jpg" || fileName.slice(fileName.length - 3) === "JPG") {
            li.style.color = "#a1acff"
        } else if (fileName.slice(fileName.length - 3) === "arw" || fileName.slice(fileName.length - 3) === "ARW") {
            li.style.color = "#ffffff"
        } else if (fileName.slice(fileName.length - 3) === "dng" || fileName.slice(fileName.length - 3) === "DNG") {
            li.style.color = "#93ff8d"
        } else if (fileName.slice(fileName.length - 3) === "png" || fileName.slice(fileName.length - 3) === "PNG") {
            li.style.color = "#bf7d43"
        } else {
            li.style.color = "#fffa2f"
        }
        li.appendChild(document.createTextNode(`${fileName} 작업 완료`))
        document
          .getElementById("logsContents")
          .appendChild(li)
    }

    // 폴더 안에 정보 읽어오기
    const dir = readdirSync(filePath)

    // 수정 날짜 기준으로 변경
    dir.sort(function(a, b) {
        return new Date(statSync(`${filePath}\\${a}`).mtime) -
          new Date(statSync(`${filePath}\\${b}`).mtime)
    })

    for (let fileName of dir) {
        // 파일 날짜 읽어오기
        const stats = statSync(`${filePath}\\${fileName}`)

        // 파일 확장자 확인
        const fileNameExtension = extname(`${filePath}\\${fileName}`)

        // 파일 확장자 종류
        const extTypes = [".lrdata", ".lrcat-data", "lrcat", "avif", ".webp", ".heic", ".heics", ".hevc", ".png", ".jpg", ".jpeg", ".jxl", ".bmp", ".gif", ".tiff", ".ai", ".psd", ".pdf", ".eps", ".psd", ".raw", ".crw", ".cr2", ".cr3", ".nef", ".nrw", ".pef", ".dng", ".raf", ".dng", ".srw", ".orf", ".srf", ".sr2", ".arw", ".rw2", ".3fr", ".dcr", ".kdc", ".mrw", ".rwl", ".dng", ".mos", ".x3f", ".gpr"]

        if (document.getElementById("exceptFolderOption").checked) {
            // 폴더와 이미지 아닌 파일들 넘기기
            if (stats.isDirectory()) continue
            else if (extTypes.indexOf(fileNameExtension.toLowerCase()) === -1) continue
        }


        // 파일 날짜 양식에 맞게 변경
        const todayDate = func(new Date(stats.mtime))

        // 기존 폴더가 만들어졌으면, 파일 이동
        // 아닐 시, 새 폴더 생성
        if (beforeDate === todayDate) {
            count++

            // 폴더 안으로 이동
            fileMove(`${filePath}\\${fileName}`, `${filePath}\\${todayDate}\\${fileName}`, fileName)
        } else {
            beforeDate = todayDate
            count++
            mkdirSync(`${filePath}\\${todayDate}`, { recursive: true })
            fileMove(`${filePath}\\${fileName}`, `${filePath}\\${todayDate}\\${fileName}`, fileName)

        }
    }

    // 작업 후, 작업 갯수 출력
    const p1 = document.createElement("p"), p2 = document.createElement("p"), p3 = document.createElement("p")
    p1.appendChild(document.createTextNode(`=========================================================================`))
    p2.appendChild(document.createTextNode(`${count}개 작업 끝`))
    p3.appendChild(document.createTextNode(`=========================================================================`))

    document
      .getElementById("lastWorkAlert")
      .appendChild(p1)

    document
      .getElementById("lastWorkAlert")
      .appendChild(p2)

    document
      .getElementById("lastWorkAlert")
      .appendChild(p3)
}

module.exports = { sortByDateFunc }