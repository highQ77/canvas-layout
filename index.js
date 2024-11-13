import { index } from "./pages/index.js"

let config = {
    fontSize: '30px',
    fontFamily: 'Arial',
    lineHeight: '1em',
}

let body = document.body
body.style.margin = '0px'
body.style.backgroundColor = "#CCC"
body.style.fontSize = config.fontSize
body.style.fontFamily = config.fontFamily
body.style.lineHeight = config.lineHeight

let app = document.getElementById('app')
app.style.position = 'absolute'
app.style.top = '0px'
let appCtx = app.getContext('2d')

let dummy = document.createElement('div')
dummy.style.position = 'absolute'
dummy.style.width = app.width + 'px'
dummy.style.height = app.height + 'px'
dummy.style.backgroundColor = 'white'
dummy.style.opacity = '.0'
dummy.style.top = '0px'
dummy.style.zIndex = 1
dummy.style.pointerEvents = 'nonse'
dummy.innerHTML = index // init page here
document.body.append(dummy)

// load assets first
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
    dom.getAttributeNames().forEach(attr => {
        dom.style[getAttr(attr)] = dom.getAttribute(attr)
    })
    switch (dom.className) {
        case 'group': drawGroup(dom); break;
        case 'label': drawLabel(dom); break;
        case 'image': drawImage(dom); break;
    }
    [...dom.children].forEach(ch => draw(ch))
}

function getBox(ele) {
    return ele.getBoundingClientRect()
}

function getAttr(str) {
    let idx = str.indexOf('_')
    if (idx > -1) {
        str = str.replace('_' + str[idx + 1], str[idx + 1].toUpperCase())
    }
    return str
}

function drawGroup(ele) {
    ele.style.display = ele.getAttribute('display') || 'block'
    let box = getBox(ele)
    let bgc = ele.getAttribute('background_color')
    if (bgc) {
        appCtx.fillStyle = bgc
        appCtx.fillRect(box.x, box.y, box.width, box.height)
    }
    let src = ele.getAttribute('background_image')
    src && appCtx.drawImage(rc[src], box.x, box.y, box.width, box.height)
}

function drawLabel(ele) {
    let box = getBox(ele)
    appCtx.font = config.fontSize + ' ' + config.fontFamily
    const fs = ele.style.height = ele.style.lineHeight = ele.getAttribute('font_size') || config.fontSize
    const ff = ele.getAttribute('font_family')
    appCtx.font = `${fs || config.fontSize} ${ff || config.fontFamily}`
    appCtx.fillStyle = ele.getAttribute('color') || 'black';
    let lines = getLines(appCtx, ele.innerText, appCtx.canvas.width)
    let mt = appCtx.measureText(ele.innerText)
    let lineHeight = parseFloat(ele.style.lineHeight)
    lines.forEach((line, idx) => {
        appCtx.fillText(
            line,
            box.x,
            box.y + mt.fontBoundingBoxAscent + idx * lineHeight
        );
    })
}

function drawImage(ele) {
    ele.style.display = 'inline-block'
    let box = getBox(ele)
    let src = ele.getAttribute('src')
    let w = ele.getAttribute('width') || box.width
    let h = ele.getAttribute('height') || box.height
    ele.style.width = w
    ele.style.height = h
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

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];
    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}


