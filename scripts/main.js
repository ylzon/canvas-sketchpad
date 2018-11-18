const canvas = document.getElementById('canvas')
const eraser = document.getElementById('eraser')
const brush = document.getElementById('brush')
const actions = document.getElementById('actions')
const context = canvas.getContext('2d')
let lineSize = 1
let lineColor = 'red'
let eraserSize = 10
let eraserEnabled = false

autoSetCanvasSize(canvas)
listenToUser(canvas)

eraser.onclick = function () {
    eraserEnabled = true
    actions.className = 'actions'
}

brush.onclick = function () {
    eraserEnabled = false
    actions.className = 'actions active'
}

function listenToUser(canvas) {
    let using = false
    let lastPoint = {
        x: 0,
        y: 0,
    }

    if (document.body.ontouchstart !== undefined) {
        // 触摸设备
        canvas.ontouchstart = function (event) {
            let x = event.touches[0].clientX 
            let y = event.touches[0].clientY
            using = true
            if (eraserEnabled) {
                context.clearRect(x, y, eraserSize, eraserSize)
            } else {
                lastPoint = { x, y }
            }
        }
        canvas.ontouchmove = function (event) {
            if (!using) return
            let x = event.touches[0].clientX 
            let y = event.touches[0].clientY
            if (eraserEnabled) {
                context.clearRect(x, y, eraserSize, eraserSize)
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
                context.clearRect(x, y, eraserSize, eraserSize)
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
                context.clearRect(x, y, eraserSize, eraserSize)
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


// function drawCircle(x, y, radius) {
//     context.beginPath()
//     context.fillStyle = lineColor
//     context.arc(x, y, radius, 0, Math.PI * 2)
//     context.fill()
// }

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