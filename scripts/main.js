const canvas = document.getElementById('canvas')
const eraser = document.getElementById('eraser')
const pen = document.getElementById('pen')
const pencil = document.getElementById('pencil')
const colors = document.getElementById('colors')
const download = document.getElementById('download')
const clear = document.getElementById('clear')

const context = canvas.getContext('2d')
let lineSize = 1
let lineColor = '#FFFFFF'
let eraserSize = 20
let eraserEnabled = false

autoSetCanvasSize(canvas)
listenToUser(canvas)

// 细笔
pen.onclick = function () {
    eraserEnabled = false
    lineSize = 1
    pen.classList.add('active')
    pencil.classList.remove('active')
    eraser.classList.remove('active')
}

// 粗笔
pencil.onclick = function () {
    eraserEnabled = false
    lineSize = 2
    pencil.classList.add('active')
    pen.classList.remove('active')
    eraser.classList.remove('active')
}

// 橡皮擦
eraser.onclick = function () {
    eraserEnabled = true
    pencil.classList.remove('active')
    pen.classList.remove('active')
    eraser.classList.add('active')
}

// 颜色设置
colors.onclick = function (event) {
    if (event.target.nodeName === 'UL') return
    lineColor = window.getComputedStyle(event.target,false)['backgroundColor']
    for (let i in event.target.parentNode.children) {
        event.target.parentNode.children[i].className = ''
    }
    event.target.classList.add('active')
}

// 清空画布
clear.onclick = function () {
    context.clearRect(0, 0, canvas.width, canvas.height)
}

// 保存画布
download.onclick = function () {
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = '我的作品'
    a.target = '_blank'
    a.click()
}


function listenToUser(canvas) {
    let using = false
    let lastPoint = {
        x: 0,
        y: 0,
    }
    let eSize = eraserSize/2
    if (document.body.ontouchstart !== undefined) {
        // 触摸设备
        canvas.ontouchstart = function (event) {
            let x = event.touches[0].clientX 
            let y = event.touches[0].clientY
            using = true
            if (eraserEnabled) {
                context.clearRect(x-eSize, y-eSize, eraserSize, eraserSize)
            } else {
                lastPoint = { x, y }
            }
        }
        canvas.ontouchmove = function (event) {
            if (!using) return
            let x = event.touches[0].clientX 
            let y = event.touches[0].clientY
            if (eraserEnabled) {
                context.clearRect(x-eSize, y-eSize, eraserSize, eraserSize)
            } else {
                drawLine(lastPoint, { x, y }, lineSize)
                lastPoint = { x, y }
            }
        }
        canvas.ontouchend = function () {
            using = false
        }
    } else {
        // 非触摸设备
        // 鼠标按下，开始绘制圆和绘制开始点
        canvas.onmousedown = function (event) {
            let x = event.clientX
            let y = event.clientY
            using = true
            if (eraserEnabled) {
                context.clearRect(x-eSize, y-eSize, eraserSize, eraserSize)
            } else {
                lastPoint = { x, y }
            }
        }

        // 鼠标移动开始连线
        canvas.onmousemove = function (event) {
            if (!using) return
            let x = event.clientX
            let y = event.clientY

            if (eraserEnabled) {
                context.clearRect(x-eSize, y-eSize, eraserSize, eraserSize)
            } else {
                drawLine(lastPoint, { x, y }, lineSize)
                lastPoint = { x, y }
            }
        }

        // 鼠标弹起结束绘制
        canvas.onmouseup = function (event) {
            using = false
        }
    }

}

// 设置画板大小为浏览器大小且自适应
function autoSetCanvasSize(canvas) {
    onCanvasResize()
    window.onresize = function () {
        onCanvasResize()
    }
    function onCanvasResize() {
        let pageWidth = document.documentElement.clientWidth
        let pageHeight = document.documentElement.clientHeight

        canvas.height = pageHeight
        canvas.width = pageWidth
    }
}

function drawLine(lastPoint, newPoint, width) {
    context.beginPath()
    context.strokeStyle = lineColor
    context.moveTo(lastPoint.x, lastPoint.y)
    context.lineWidth = width * 2
    context.lineTo(newPoint.x, newPoint.y)
    context.stroke()
    context.closePath()
}