import { index } from "./pages/index.js"
import { demo } from "./pages/demo.js"

let config = {
    fontSize: '30px'
}

let body = document.body
body.style.margin = '0px'
body.style.backgroundColor = "#CCC"
body.style.fontSize = config.fontSize

let app = document.getElementById('app')
app.style.position = 'absolute'
app.style.top = '0px'

let appCtx = app.getContext('2d')
let dummy = document.createElement('div')
dummy.style.position = 'absolute'
dummy.style.width = app.width + 'px'
dummy.style.height = app.height + 'px'
dummy.style.backgroundColor = 'white'
dummy.style.opacity = '0'
dummy.style.position = 'absolute'
dummy.style.top = '0px'
dummy.style.pointerEvents = 'none'
dummy.innerHTML = demo
document.body.append(dummy)

let rc
loadResource(['bunny.png']).then(r => {
    rc = r
    window.onresize = resize
    window.onload = resize
    resize()
})

function loadResource(imgList, rc) {
    rc = rc || {}
    return new Promise(resolve => {
        let image = new Image
        image.onload = () => {
            image.onload = null
            rc[image.src.split(location.href)[1]] = image
            if (imgList.length) loadResource(imgList[0])
            else resolve(rc)
        }
        image.src = imgList.shift()
    })
}

function draw(dom) {
    switch (dom.className) {
        case 'group': drawGroup(dom); break;
        case 'label': drawLabel(dom); break;
        case 'image': drawImage(dom); break;
    }
    [...dom.children].forEach(ch => draw(ch))
}

function drawGroup(ele) {
    ele.style.display = ele.getAttribute('display') || 'flex'
    ele.style.flexWrap = 'wrap'
    ele.style.maxWidth = window.innerWidth + 'px'
    ele.style.flexFlow = ele.getAttribute('flow') || 'row'
    ele.style.justifyContent = ele.getAttribute('justifyContent') || 'flex-start';
    let box = ele.getBoundingClientRect()
    let pbox = ele.parent?.getBoundingClientRect()
    box.x = ele.parent ? (box.x - pbox.x) : box.x
    box.y = ele.parent ? (box.y - pbox.y) : box.y
    let bgc = ele.getAttribute('bgColor')
    if (bgc) {
        appCtx.fillStyle = bgc
        appCtx.fillRect(box.x, box.y, box.width, box.height)
    }
    let src = ele.getAttribute('bgImage')
    src && appCtx.drawImage(rc[src], box.x, box.y, box.width, box.height)
}

function drawLabel(ele) {
    let box = ele.getBoundingClientRect()
    let pbox = ele.parent?.getBoundingClientRect()
    box.x = ele.parent ? (box.x - pbox.x) : box.x
    box.y = ele.parent ? (box.y - pbox.y) : box.y
    appCtx.font = config.fontSize + ' serif';
    const size = ele.getAttribute('size')
    size && (appCtx.font = size + 'px serif')
    ele.style.fontSize = size + 'px'
    appCtx.fillStyle = ele.getAttribute('color') || 'black';
    appCtx.fillText(
        ele.innerText,
        box.x,
        box.y + appCtx.measureText(ele.innerText).fontBoundingBoxAscent
    );
}

function drawImage(ele) {
    ele.style.display = 'inline-block'
    let box = ele.getBoundingClientRect()
    let pbox = ele.parent?.getBoundingClientRect()
    box.x = ele.parent ? (box.x - pbox.x) : box.x
    box.y = ele.parent ? (box.y - pbox.y) : box.y
    let src = ele.getAttribute('src')
    let w = ele.getAttribute('width') || box.width
    let h = ele.getAttribute('height') || box.height
    ele.style.width = w + 'px'
    ele.style.height = h + 'px'
    ele.style.backgroundSize = '100% 100%'
    src && appCtx.drawImage(rc[src], box.x, box.y, box.width, box.height)
}

function resize() {
    app.width = window.innerWidth
    app.height = window.innerHeight
    dummy.style.width = app.width + 'px'
    dummy.style.height = app.height + 'px'
    draw(dummy)
}
