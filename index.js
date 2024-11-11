import { index } from "./pages/index.js"

let config = {
    fontSize: '32px'
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
dummy.innerHTML = index
document.body.append(dummy)
window.onresize = resize
window.onload = resize
resize()

function draw(dom) {
    [...dom.children].forEach(ch => {
        draw(ch)
        switch (ch.className) {
            case 'group': drawGroup(ch); break;
            case 'label': drawLabel(ch); break;
            case 'image': drawImage(ch); break;
        }
    })
}

function drawGroup(ele) {
    ele.style.display = 'flex'
    ele.style.flexWrap = 'wrap'
    ele.style.justifyContent = ele.getAttribute('justifyContent') || 'flex-start';
}

function drawLabel(ele) {
    let box = ele.getBoundingClientRect()
    let pbox = ele.parent?.getBoundingClientRect()
    box.x = ele.parent ? (box.x - pbox.x) : box.x
    box.y = ele.parent ? (box.y - pbox.y) : box.y
    appCtx.font = config.fontSize + ' serif';
    appCtx.fillStyle = ele.getAttribute('color') || 'black';
    appCtx.fillText(
        ele.innerText,
        box.x,
        box.y + appCtx.measureText(ele.innerText).fontBoundingBoxAscent
    );
}

function drawImage(ele) {
    let box = ele.getBoundingClientRect()
    let pbox = ele.parent?.getBoundingClientRect()
    box.x = ele.parent ? (box.x - pbox.x) : box.x
    box.y = ele.parent ? (box.y - pbox.y) : box.y
    let src = ele.getAttribute('src')
    let w = ele.getAttribute('width')
    let h = ele.getAttribute('height')
    // ele.style.backgroundImage = `url(${src})`;
    ele.style.width = w + 'px'
    ele.style.height = h + 'px'
    ele.style.backgroundSize = '100% 100%'
    if (!ele.image) {
        ele.image = new Image
        ele.image.onload = () => {
            ele.image.onload = null
            appCtx.drawImage(ele.image, box.x, box.y, parseInt(w), parseInt(h))
        }
        ele.image.src = src
    } else {
        appCtx.drawImage(ele.image, box.x, box.y, parseInt(w), parseInt(h))
    }
}

function resize() {
    app.width = window.innerWidth
    app.height = window.innerHeight
    dummy.style.width = app.width + 'px'
    dummy.style.height = app.height + 'px'
    draw(dummy)
}
