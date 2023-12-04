const { changeNoiseReduceFunc } = require("/web/photo/electron/plugins/changeNoiseReduce")
const { sortByDateFunc } = require("/web/photo/electron/plugins/sortByDateFunc")
const { alerts } = require("/web/photo/electron/plugins/alerts")

// 작업 시작 함수
function startWork() {

    // 작업 선택
    const selectWorkType = document.querySelector("input[name='selectWorkType']:checked")

    if (!selectWorkType) {
        alerts("selectAlert")
        return 0
    }

    // 파일 주소
    let filePath = document.getElementById("folderPathStyle").value

    if (filePath.length === 0) {
        // document.getElementById("filePathAlert").style.visibility = "visible"
        alerts("filePathAlert")

    }

    if (selectWorkType.value === "ChangeNoiseReduce") {
        changeNoiseReduceFunc(filePath)
    } else if (selectWorkType.value === "SortByDate") {
        sortByDateFunc(filePath)
    }
}