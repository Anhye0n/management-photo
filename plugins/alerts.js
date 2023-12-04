function alerts(elementName) {
    document.getElementById(elementName).style.display = "flex"
    setTimeout(() => {
        document.getElementById(elementName).style.opacity = "1"
    }, 100)
    setTimeout(() => {
        document.getElementById(elementName).style.opacity = "0"
    }, 2000)
    setTimeout(() => {
        document.getElementById(elementName).style.display = "none"
    }, 2200)
}

module.exports = { alerts }