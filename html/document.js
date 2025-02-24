const doc = document;
const htmlEl = doc.documentElement;
const {body, head} = doc;
const createElement = n => doc.createElement(n);
const createImage = _ => new Image();
const addEvent = (el, ev, cb) => el[`on${ev}`] = cb;// 元素.addEventListener(事件,cb);
const getRect = el => el.getBoundingClientRect();
const $ = (s, el = doc) => el.querySelector(s);
const setlevelEl = $('.set-level');
const setLevelTitleEl = setlevelEl.children[0];
const countryBoxEl = $('#countrys');
const closeAll = _ => {
    setLevelStyle.display = '';
};
const data = {};
const getCountryEls = _ => [...countryBoxEl.children];
const getLevels = _ => getCountryEls().map(el => el.getAttribute('level') || '0');
const localStorageLevelsKey = 'world-ex-levels';
const saveLevels = _ => {
    localStorage.setItem(localStorageLevelsKey, getLevels().join(''));
};
const gelLevelsAndSet = _ => {
    const levels = localStorage.getItem(localStorageLevelsKey) || '';
    getCountryEls().forEach((el, i) => {
        el.setAttribute('level', levels[i] || '0')
    })
};
const svgEl = body.querySelector('svg');
const setLevelStyle = setlevelEl.style;
const minMargin = 6;
addEvent(countryBoxEl, 'click', e => {
    e.stopPropagation();

    const {target} = e;
    const targetRect = getRect(target);
    const {id} = target;
    data.target = target;
    data.id = id;

    setLevelTitleEl.innerHTML = id.replace("2", "");
    setLevelStyle.display = 'block';
    const setLevelElRect = getRect(setlevelEl);
    const targetBBox = target.getBBox();
    const svgElBBox = svgEl.getBBox();
    const svgRect = getRect(svgEl);

    let left = Math.round(body.scrollLeft + targetRect.left + targetRect.width / 2 - setLevelElRect.width / 2);
    let top = Math.round(body.scrollTop + targetRect.top + targetRect.height / 2 - setLevelElRect.height / 2);

    top = body.scrollTop;

    const scalc = svgRect.width / 2000;

    left = targetBBox.x * scalc + svgElBBox.x;
    top = targetBBox.y * scalc + svgElBBox.y;
    // console.log(svgEl,targetBBox,svgElBBox)

    left = e.pageX + -setLevelElRect.width / 2 + body.scrollLeft;
    top = e.pageY + -setLevelElRect.height / 2 + body.scrollTop + 4;


    setLevelStyle.left = left + 'px';
    setLevelStyle.top = top + 'px';
});
addEvent(doc, 'click', closeAll);
const scoreEl = $('#score');
const stat = _ => {
    const score = getLevels().reduce((all, a) => {
        return +all + (+a || 0);
    }, 0);
    scoreEl.innerHTML = `分数: ${score}`;
}
addEvent(setlevelEl, 'click', e => {
    e.stopPropagation();
    const level = e.target.getAttribute('data-level');
    if (!level) return false;
    data.target.setAttribute('level', level);
    stat();
    closeAll();
    saveLevels();
})

gelLevelsAndSet();
stat();

setTimeout(_ => htmlEl.removeAttribute('data-loading'), 2e3);

const width = 2560;
const height = 2480;
const zoom = 1;

const canvas = createElement('canvas');

canvas.width = width * zoom;
canvas.height = width * zoom;

const ctx = canvas.getContext('2d');

const fromXMLCreateImageSrc = text => {
    const blob = new Blob([text], {type: 'image/svg+xml'});
    return URL.createObjectURL(blob);
};
const isSNS = /weibo|qq/i.test(navigator.userAgent);
// alert(navigator.userAgent)
const saveFile = (link, filename, el = createElement('a')) => {
    if (!isSNS) {
        el.download = filename;
    }
    el.href = link;
    el.click();
};
const urlToImageEl = (url, cb) => {
    const img = createImage();
    addEvent(img, 'load', _ => setTimeout(_ => cb(img), 500));
    img.src = url;
};

const outputEl = $('.output');
const outputImageStyle = outputEl.style;
const generateName = _ => Math.floor((+new Date() - 163e10) / 1e4).toString(32);
const saveImage = _ => {
    htmlEl.setAttribute('data-running', 'true');

    const xmlText = `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}px" height="${height}px">${svgEl.innerHTML}</svg>`;
    const dataURL = fromXMLCreateImageSrc(xmlText);
    urlToImageEl(dataURL, imgEl => {
        ctx.fillStyle = '#56c5c1';
        ctx.fillRect(
            0, 0,
            width * zoom, width * zoom
        );
        ctx.drawImage(
            imgEl,
            0, 0,
            width, height,
            0, (width - height) * zoom / 2,
            width * zoom, height * zoom
        );
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            outputEl.querySelector('img').src = url;
            outputImageStyle.display = '';

            setTimeout(_ => {
                saveFile(url, `[制霸南科]${generateName()}.png`);
                htmlEl.removeAttribute('data-running');
            }, 50)
        }, 'image/png');
    });
};

const shareEl = $(".about");
addEvent($('#share-btn'), 'click', function () {
    shareEl.style.display = "flex";
});
addEvent($('.btn', shareEl), 'click', _ => {
    shareEl.style.display = 'none';
});

addEvent($('#save-btn'), 'click', saveImage);

addEvent($('a', outputEl), 'click', _ => {
    outputImageStyle.display = 'none'
});