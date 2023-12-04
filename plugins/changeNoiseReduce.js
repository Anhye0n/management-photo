const { readdirSync, renameSync } = require("fs")
const { extname } = require("path")
const { alerts } = require("/web/photo/electron/plugins/alerts")

// 노이즈 제거 이름 변경 함수
function changeNoiseReduceFunc(filePath) {
    let dir

    // 파일 경로가 잘못 됐을 시, 작동 중지 방지
    try {
        dir = readdirSync(filePath)

    } catch (err) {
        alerts("filePathAlert")

        document.getElementById("folderPathStyle").value = ""
    }

    // 작업 갯수 출력
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
    for (let fileName of dir) {
        if (fileName.slice((fileName.length - 15), (fileName.length - 4)) === "-향상됨-노이즈 감소") {
            count++
            // 파일 확장자 저장
            const fileNameExtension = extname(`${filePath}\\${fileName}`)

            // 파일 이름 변경
            const changeFileName = fileName.slice(0, (fileName.length - 15)) + "-N" + fileNameExtension
            renameSync(`${filePath}\\${fileName}`, `${filePath}\\${changeFileName}`)

            // 작업 로그
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
            li.appendChild(document.createTextNode(`${fileName} → ${changeFileName} 작업 완료`))
            document
              .getElementById("logsContents")
              .appendChild(li)
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

module.exports = { changeNoiseReduceFunc }