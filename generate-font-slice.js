let fontAPI = `https://lab.magiconch.com/api/fontmin`;
const generateFontURL = (name, text) => {
    text += '0';
    text = text.replace(/\s/g, '');
    text = Array.from(new Set(text)).sort().join('');

    console.log(text);

    if (!text) return requestAnimationFrame(onOver);

    const unicode = str2utf8(text).join();
    const fontURL = `${fontAPI}?name=${name}&unicode=${unicode}&type=woff`;

    return fontURL;
};

const getFontFromText = (name, text, onOver = _ => {
}) => {
    const fontURL = generateFontURL(name, text);
    loadFont(name, fontURL, _ => {
        onOver(_)
        // style.innerHTML = `html {font-family: a123;}`;
    })
};

const loadFont = async (fontName, fontURL, callback) => {
    const fontFace = new FontFace(fontName, `url(${fontURL})`);
    fontFace.load().then(fontFace => {
        document.fonts.add(fontFace);
        callback(fontFace);
    }).catch(e => {
        // console.log(e);
        callback();
    })
};

function str2utf8(str) {
    return str.split('').map(s => s.charCodeAt(0))
}

function utf82str(str) {
    return String.fromCharCode.apply(null, Array.from(str))
};

const {readFileSync, writeFileSync} = require('fs');
const getTextFromHTMLFile = (filename) => {
    let html = readFileSync(filename, 'utf8');
    const texts = [];

    const addTextFromMatch = (all, text) => {
        text = text.replace(/<.+?>/g, '');

        texts.push(text);
        return '';
    }
    html = html.replace(/<(?:path|rect) id="(.+?)"/g, addTextFromMatch);
    html = html.replace(/<text .+?>(.+?)<\/text>/g, addTextFromMatch);
    html = html.replace(/<a .+?>(.+?)<\/a>/g, addTextFromMatch);
    html = html.replace(/<h2 .+?>(.+?)<\/h2>/g, addTextFromMatch);
    html = html.replace(/<p>([\s\S]+?)<\/p>/g, addTextFromMatch);
    html = html.replace(/id="(.+?)"/g, addTextFromMatch);

    return texts.join('');
};

const defaultText = `1234567890:`;
const text = defaultText + getTextFromHTMLFile('html/index.html') + getTextFromHTMLFile('nkd-ex2.svg');
const fontURL = generateFontURL(`JiaLiDaYuanJF`, text);


// console.log(text);
// console.log(fontURL);

const axios = require('axios');


const downFontFile = async _ => {
    let r = await axios.get(fontURL, {
        responseType: 'arraybuffer'
    });
    // console.log(r.data);
    writeFileSync('html/slice.woff', r.data, 'binary');
};

downFontFile();