const axios = require('axios');
const cheerio = require('cheerio');
const jsobfus = require('javascript-obfuscator');

async function obfus(content, type = 'low') {
return new Promise((resolve, reject) => {
let methods = ["low", "medium", "high"];
methods.includes(type) ? (type = type) : (type = methods[0]);
try {
const method = {
// kebingungan sedang, performa tinggi
// performanya akan berada pada level yang relatif normal
low: {
compact: true,
controlFlowFlattening: true,
controlFlowFlatteningThreshold: 1,
numbersToExpressions: true,
simplify: true,
stringArrayShuffle: true,
splitStrings: true,
stringArrayThreshold: 1
},
// kebingungan sedang, kinerja optimal
// performanya akan lebih lambat dibandingkan tanpa kebingungan
medium: {
compact: true,
controlFlowFlattening: false,
deadCodeInjection: false,
debugProtection: false,
debugProtectionInterval: 0,
disableConsoleOutput: false,
identifierNamesGenerator: 'hexadecimal',
log: true,
numbersToExpressions: false,
renameGlobals: false,
selfDefending: true,
simplify: true,
splitStrings: false,
stringArray: true,
stringArrayCallsTransform: false,
stringArrayEncoding: [],
stringArrayIndexShift: true,
stringArrayRotate: true,
stringArrayShuffle: true,
stringArrayWrappersCount: 1,
stringArrayWrappersChainedCalls: true,
stringArrayWrappersParametersMaxCount: 2,
stringArrayWrappersType: 'variable',
stringArrayThreshold: 0.75,
unicodeEscapeSequence: false
},
// kebingungan tinggi, kinerja rendah
// performanya akan jauh lebih lambat dibandingkan tanpa kebingungan
high: {
compact: true,
controlFlowFlattening: true,
controlFlowFlatteningThreshold: 0.75,
deadCodeInjection: true,
deadCodeInjectionThreshold: 0.4,
debugProtection: false,
debugProtectionInterval: 0,
disableConsoleOutput: false,
identifierNamesGenerator: 'hexadecimal',
log: true,
numbersToExpressions: true,
renameGlobals: false,
selfDefending: true,
simplify: true,
splitStrings: true,
splitStringsChunkLength: 10,
stringArray: true,
stringArrayCallsTransform: true,
stringArrayCallsTransformThreshold: 0.75,
stringArrayEncoding: ['base64'],
stringArrayIndexShift: true,
stringArrayRotate: true,
stringArrayShuffle: true,
stringArrayWrappersCount: 2,
stringArrayWrappersChainedCalls: true,
stringArrayWrappersParametersMaxCount: 4,
stringArrayWrappersType: 'function',
stringArrayThreshold: 0.75,
transformObjectKeys: true,
unicodeEscapeSequence: false
},
}

const obfuscationResult = jsobfus.obfuscate(content, method[type]);
const result = {
status: 200,
developer: 'SuryaDev.',
result: obfuscationResult.getObfuscatedCode()
}
resolve(result)
} catch (error) {
const result = {
status: 400,
developer: 'SuryaDev.',
result: String(error)
}
resolve(result)
}
})
}

async function alquran(surah, ayat) {
let res = await fetch(`https://kalam.sindonews.com/ayat/${ayat}/${surah}`)
if (!res.ok) throw 'Error, maybe not found?'
let $ = cheerio.load(await res.text())
let content = $('body > main > div > div.content.clearfix > div.news > section > div.list-content.clearfix')
let Surah = $(content).find('div.ayat-title > h1').text()
let arab = $(content).find('div.ayat-detail > div.ayat-arab').text()
let latin = $(content).find('div.ayat-detail > div.ayat-latin').text()
let terjemahan = $(content).find('div.ayat-detail > div.ayat-detail-text').text()
let tafsir = ''
$(content).find('div.ayat-detail > div.tafsir-box > div').each(function () {
tafsir += $(this).text() + '\n'
})
tafsir = tafsir.trim()
let keterangan = $(content).find('div.ayat-detail > div.ayat-summary').text()
// https://quran.kemenag.go.id/assets/js/quran.js
let audio = `https://quran.kemenag.go.id/cmsq/source/s01/${surah < 10 ? '00' : surah >= 10 && surah < 100 ? '0' : ''}${surah}${ayat < 10 ? '00' : ayat >= 10 && ayat < 100 ? '0' : ''}${ayat}.mp3`
return {
developer: 'SuryaDev.',
surah: Surah,
arab,
latin,
terjemahan,
tafsir,
audio,
keterangan,
}
}

async function instagramdl(url) {
return new Promise(async (resolve, reject) => {
const res = await fetch('https://v3.igdownloader.app/api/ajaxSearch', {
method: 'POST',
body: new URLSearchParams({
recapthaToken: '',
q: url,
t: 'media',
lang: 'id',
}),
}).then((v) => v.json()).then((v) => v.data);
if (!res) return reject('Video Bersifat Pribadi');
const data = [];
const $ = cheerio.load(res);
const downloads = $('ul');
$(downloads).find('li').each((i, el) => {
data.push({
type: $(el).find('a[title]').attr('title').toLowerCase().includes('photo') ? 'photo' : 'video',
thumbnail: $(el).find('img').attr('data-src') || $(el).find('img').attr('src'),
media: $(el).find('a[title]').attr('href'),
});
});
resolve(data);
});
}

async function tiktokSearch(query) {
return new Promise(async (resolve, reject) => {
try {
const response = await fetch('https://tikwm.com/api/feed/search', {
method: 'POST',
headers: {
"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
Cookie: "current_language=en",
"User-Agent":
"Mozilla/5.0 (Linux Android 10 K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
},
body: new URLSearchParams({
keywords: query,
count: 10,
cursor: 0,
HD: 1,
}),
}).then((v) => v.json());
const videos = response.data.videos;
if (videos.length === 0) {
reject("Tidak ada video ditemukan.");
} else {
const dann = Math.floor(Math.random() * videos.length);
const video = videos.map((v) => {
return {
title: v.title,
cover: v.cover,
origin_cover: v.origin_cover,
link: `https://www.tiktok.com/@${v.author.unique_id}/video/${v.video_id}`,
no_watermark: v.play,
watermark: v.wmplay,
music: v.music_info,
views: v.play_count,
like: v.digg_count,
comment: v.comment_count || null,
share: v.share_count,
download: v.download_count || null,
save: v.collect_count || null,
create_time: v.create_time * 1000,
};
});
resolve(video);
}
} catch (error) {
reject(error);
}
});
}

async function tiktokInfo(url) {
return new Promise(async (resolve, reject) => {
try {
const response = await fetch("https://tikwm.com/api/", {
method: "POST",
headers: {
"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
Cookie: "current_language=en",
"User-Agent":
"Mozilla/5.0 (Linux Android 10 K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
},
body: new URLSearchParams({
region: "id",
url: url,
count: 10,
cursor: 0,
HD: 1,
}),
}).then((v) => v.json());
const video = response.data;
if (video.length === 0) {
reject("Tidak ada video ditemukan.");
} else {
const result = {
title: video.title,
cover: video.cover,
origin_cover: video.origin_cover,
link: `https://www.tiktok.com/@${video.author.unique_id}/video/${video.id}`,
no_watermark: video.play,
hd: video.hdplay || null,
watermark: video.wmplay,
music: video.music,
no_wm_size: video.size,
wm_size: video.wm_size,
hd_size: video.hd_size || null,
views: video.play_count,
like: video.digg_count,
comment: video.comment_count || null,
share: video.share_count,
download: video.download_count || null,
save: video.collect_count,
create_time: video.create_time * 1000,
};
resolve(result);
}
} catch (error) {
reject(error);
}
});
}

const jarak = async (dari, ke) => {
try {
let html = (await axios(`https://www.google.com/search?q=${encodeURIComponent('jarak ' + dari + ' ke ' + ke)}&hl=id`)).data
let $ = cheerio.load(html);
let img = html.split("var s=\'")?.[1]?.split("\'")?.[0]
let buffer = /^data:.*?\/.*?;base64,/i.test(img) ? Buffer.from(img.split(',')[1], 'base64') : ''
let desc = $('div.BNeawe.deIvCb.AP7Wnd').text()?.trim()
let result = {
status: true,
developer: 'SuryaDev',
desc: desc,
buffer: buffer
}
return result
} catch (e) {
let result = {
status: false,
developer: 'SuryaDev',
message: String(e)
}
return result
}
}

/**
 * Scraped By Kaviaann
 * Protected By MIT LICENSE
 * Whoever caught removing wm will be sued
 * @param {string} url
 * @param {{
 * audio : Boolean,
 * aFormat : 'best'|'mp3'|'ogg'|'wav'|'opus',
 * vCodec : 'standar'|'high'|'medium',
 * vReso : 'max'|'8k\+?'|'4k'|'1440p?'|'1080p?'|'720p?'|'480p?'|'360p?'|'240p?'|'144p?'
 * }} options
 * @returns {
 *status : 'stream'|'success'|'picker'|'error'|'redirected'|'rate-limit'|
 * }
 * @author Kaviaann 2024
 * @copyright https://whatsapp.com/channel/0029Vac0YNgAjPXNKPXCvE2e
 */
async function cobalt(
url,
options = {
audio: false,
aFormat: "mp3",
vCodec: "standar",
vReso: "720p",
mute: false,
}
) {
return new Promise(async (resolve, reject) => {
try {
if (!url) return reject("Insert URL!");

// ? OPTIONS
let { audio, aFormat, vCodec, vReso, mute } = options;

const prop = {};
const data = {
url: url,
filenamePattern: "pretty",
};

// ? AUDIO
if (audio) {
const aFRegex = /best|mp3|ogg|wav|opus/gi;
if (!aFormat) aFormat = "mp3";
if (!aFRegex.test(aFormat)) aFormat = "mp3";
data.isAudioOnly = true;
data.aFormat = aFormat;
prop.type = "audio";
prop.mtype = aFormat;
}

// ? VIDEO
else {
// ? REGEXP
const vCRegex = /standar|high|medium/gi;
const vRRegex =
/max|8k\+?|4k|1440p?|1080p?|720p?|480p?|360p?|240p?|144p?/gi;

// ? IF
if (!vReso) vReso = "720p";
if (!vCodec) vCodec = "standar";
if (!vCRegex.test(vCRegex)) vCodec = "standar";
if (!vRRegex.test(vReso)) vReso = "720p";
if (!mute) mute = false;

// ? QUALITY
if (vReso === "8k+") vReso = "max";

// ? CODEC
switch (vCodec) {
case "standar": {
vCodec = "h246";
break;
}
case "high": {
vCodec = "av1";
break;
}
case "medium": {
vCodec = "vp9";
break;
}
default: {
vCodec: "h246";
break;
}
}

data.vCodec = vCodec;
data.vQuality = vReso;
data.isAudioOnly = false;
data.isAudioMuted = mute;
prop.type = "video";
prop.hd = /max|8k+?|4k|1440p?/gi.test(vReso);
prop.quality = vReso === "max" ? "8k+" : vReso;
prop.codec = vCodec;
prop.isMuted = mute;
}

// ? FETCHING
const BASE_URL = "https://cobalt.tools";
const BASE_API = "https://api.cobalt.tools/api";
await fetch(BASE_API + "/json", {
method: "OPTIONS",
headers: {
"access-control-request-method": "POST",
"access-control-request-headers": "content-type",
"user-agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
origin: BASE_URL,
referer: BASE_URL,
},
}).then(async () => {
const result = await fetch(BASE_API + "/json", {
method: "POST",
headers: {
origin: BASE_URL,
referer: BASE_URL,
"user-agent": BASE_URL,
"content-type": "application/json",
accept: "application/json",
},
body: JSON.stringify(data),
}).then((v) => v.json());

return resolve({
status: true,
developer: 'SuryaDev',
...result,
...prop
});
});
} catch (error) {
reject({
status: false,
developer: 'SuryaDev',
message: String(error)
});
}
});
}

async function snackvideo(url) {
return new Promise(async (resolve, reject) => {
try {
if (!/snackvideo.com/gi.test(url)) return reject("Invalid URL!");
const res = await fetch(url).then((v) => v.text());
const $ = cheerio.load(res);
const video = $("div.video-box").find("a-video-player");
const author = $("div.author-info");
const attr = $("div.action");
const data = {
status: true,
developer: 'SuryaDev',
title: $(author).find("div.author-desc > span").children("span").eq(0).text().trim(),
thumbnail: $(video).parent().siblings("div.background-mask").children("img").attr("src"),
media: $(video).attr("src"),
author: $("div.author-name").text().trim(),
authorImage: $(attr).find("div.avatar > img").attr("src"),
like: $(attr).find("div.common").eq(0).text().trim(),
comment: $(attr).find("div.common").eq(1).text().trim(),
share: $(attr).find("div.common").eq(2).text().trim(),
};
resolve(data);
} catch (error) {
resolve({
developer: 'SuryaDev',
status: false,
message: String(error)
});
}
});
}

const snapsave = async (url) => {
try {
if (url.match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/) || url.match(/https:\/\/www.instagram.com\/(p|reel|tv)/gi)) {
function decodeData(encodedData) {
let [dataString, separator, mapping, offset, mappingIndex, decodedString] = encodedData;
function baseConvert(value, baseFrom, baseTo) {
const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split('');
let baseFromChars = characters.slice(0, baseFrom);
let baseToChars = characters.slice(0, baseTo);
let decimalValue = value.split('').reverse().reduce(function (accumulatedValue, char, index) {
if (baseFromChars.indexOf(char) !== -1) {
return accumulatedValue += baseFromChars.indexOf(char) * Math.pow(baseFrom, index);
}
}, 0);
let convertedValue = '';
while (decimalValue > 0) {
convertedValue = baseToChars[decimalValue % baseTo] + convertedValue;
decimalValue = (decimalValue - decimalValue % baseTo) / baseTo;
}
return convertedValue || '0';
}
decodedString = '';
let index = 0;
for (let length = dataString.length; index < length; index++) {
let segment = '';
while (dataString[index] !== mapping[mappingIndex]) {
segment += dataString[index];
index++;
}
for (let i = 0; i < mapping.length; i++) {
segment = segment.replace(new RegExp(mapping[i], 'g'), i.toString());
}
decodedString += String.fromCharCode(baseConvert(segment, mappingIndex, 10) - offset);
}
return decodeURIComponent(encodeURIComponent(decodedString));
}
function extractData(res) {
return res.split("decodeURIComponent(escape(r))}(")[1].split('))')[0].split(',').map(item => item.replace(/"/g, '').trim());
}

const response = await axios.post("https://snapsave.app/action.php?lang=id", {
url: url
}, {
headers: {
'accept': "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
'content-type': "application/x-www-form-urlencoded",
'origin': "https://snapsave.app",
'referer': "https://snapsave.app/id",
'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
}
});

const extractedData = decodeData(extractData(response.data)).split("getElementById(\"download-section\").innerHTML = \"")[1].split("\"; document.getElementById(\"inputData\").remove(); ")[0].replace(/\\(\\)?/g, '');
const $ = cheerio.load(extractedData);
const result = [];
if ($("table.table").length || $("article.media > figure").length) {
const thumbnail = $("article.media > figure").find("img").attr("src");
$("tbody > tr").each((index, row) => {
const rowElement = $(row);
const columns = rowElement.find('td');
const resolution = columns.eq(0).text();
let link = columns.eq(2).find('a').attr("href") || columns.eq(2).find("button").attr("onclick");
const shouldRender = /get_progressApi/ig.test(link || '');
if (shouldRender) {
link = /get_progressApi\('(.*?)'\)/.exec(link || '')?.[1] || link;
}
result.push({
resolution: resolution,
thumbnail: thumbnail,
url: link,
shouldRender: shouldRender
});
});
} else {
$('div.download-items__thumb').each((index, thumb) => {
const thumbImage = $(thumb).find('img').attr('src');
$('div.download-items__btn').each((btnIndex, button) => {
let buttonLink = $(button).find('a').attr('href');
if (!/https?:\/\//.test(buttonLink || '')) {
buttonLink = 'https://snapsave.app' + buttonLink;
}
result.push({
thumbnail: thumbImage,
url: buttonLink
});
});
});
}
if (!result.length) {
return {
developer: 'SuryaDev',
status: false,
msg: "Empty data."
};
}
return {
developer: 'SuryaDev',
status: true,
data: result
};
} else return {
developer: 'SuryaDev',
status: false,
msg: "URL is Invalid!"
};
} catch (error) {
return {
developer: 'SuryaDev',
status: false,
msg: String(error)
};
}
};

const getUrl = async (url) => {
try {
const res = await axios.get(url);
const $ = cheerio.load(res.data);
let hrefs = [];
$('.overlay-s').each((index, element) => {
const href = $(element).parent().attr('href');
hrefs.push(href);
});
return hrefs;
} catch (error) {
console.error('Error getting token:', error);
throw error;
}
}

const getVidWm = async (url) => {
try {
const hrefs = await getUrl(url);
const randomIndex = Math.floor(Math.random() * hrefs.length);
const randomVid = hrefs[randomIndex];
const res = await axios.get(randomVid);
const $ = cheerio.load(res.data);
const href = $('video').attr('src');
return {
status: true,
developer: 'SuryaDev',
video: href
}
} catch (error) {
console.error('Error scraping:', error);
}
}

const tiktokdl = async(url) => {
try {
let host = 'https://www.tikwm.com/';
let res = await axios.post(host+'api/', {}, {
headers: {
'accept': 'application/json, text/javascript, */*; q=0.01',
'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
},
params: {
url: url,
count: 12,
cursor: 0,
web: 1,
hd: 1
}
})

return {
status: true,
developer: 'SuryaDev.',
wm: host+res.data.data.wmplay,
music: host+res.data.data.music,
video: host+res.data.data.play
}
} catch (error) {
return {
status: false,
developer: 'SuryaDev.',
message: String(error)
}
}
}

// Export fungsi ssweb
const ssweb = (url, device = 'desktop') => {
return new Promise((resolve, reject) => {
const base = 'https://www.screenshotmachine.com'
const param = {
url: url,
device: device,
cacheLimit: 0
}
axios({
url: base + '/capture.php',
method: 'POST',
data: new URLSearchParams(Object.entries(param)),
headers: {
'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
}
}).then((data) => {
const cookies = data.headers['set-cookie']
if (data.data.status == 'success') {
axios.get(base + '/' + data.data.link, {
headers: {
'cookie': cookies.join('')
},
responseType: 'arraybuffer'
}).then(({ data }) => {
result = {
status: true,
result: data
}
resolve(result)
})
} else {
reject(new Error({ status: false, statuses: `Link Error`, message: data.data }))
}
}).catch(reject)
})
}

const stickersearch = async (query) => {
return new Promise((resolve, reject) => {
try {
axios.get(`https://getstickerpack.com/stickers?query=${query}`)
.then(({ data }) => {
const $ = cheerio.load(data)
const link = [];
$('#stickerPacks > div > div:nth-child(3) > div > a').each(function(a, b) {
link.push($(b).attr('href'))
})
rand = link[Math.floor(Math.random() * link.length)]
axios.get(rand)
.then(({ data }) => {
const $$ = cheerio.load(data)
const url = [];
$$('#stickerPack > div > div.row > div > img').each(function(a, b) {
url.push($$(b).attr('src').split('&d=')[0])
})
resolve({
status: true,
developer: 'SuryaDev',
title: $$('#intro > div > div > h1').text(),
author: $$('#intro > div > div > h5 > a').text(),
author_link: $$('#intro > div > div > h5 > a').attr('href'),
sticker: url
})
})
})
} catch (error) {
resolve({
status: false,
developer: 'SuryaDev',
message: String(error)
})
}
})
}

// Export fungsi nickff
const nickff = (userId) => {
if (!userId) return reject(new Error("no userId"));
return new Promise((resolve, reject) => {
let body = {
"voucherPricePoint.id": 8050,
"voucherPricePoint.price": "",
"voucherPricePoint.variablePrice": "",
"n": "",
"email": "",
"userVariablePrice": "",
"order.data.profile": "",
"user.userId": userId,
"voucherTypeName": "FREEFIRE",
"affiliateTrackingId": "",
"impactClickId": "",
"checkoutId": "",
"tmwAccessToken": "",
"shopLang": "in_ID"
};
axios({
"url": "https://order.codashop.com/id/initPayment.action",
"method": "POST",
"data": body,
"headers": {
"Content-Type": "application/json; charset/utf-8",
"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
}
}).then(({ data }) => {
resolve({
"username": data.confirmationFields.roles[0].role,
"userId": userId,
"country": data.confirmationFields.country
});
}).catch(reject);
});
}

// Export fungsi nickml
const nickml = (id, zoneId) => {
return new Promise(async (resolve, reject) => {
axios.post('https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store',
new URLSearchParams(Object.entries({
productId: '1',
itemId: '2',
catalogId: '57',
paymentId: '352',
gameId: id,
zoneId: zoneId,
product_ref: 'REG',
product_ref_denom: 'AE',
})),
{
headers: {
'Content-Type': 'application/x-www-form-urlencoded',
Referer: 'https://www.duniagames.co.id/',
Accept: 'application/json',
},
}
).then((response) => {
resolve(response.data.data.gameDetail)
}).catch((err) => {
reject(err)
})
})
}

class Ytdl {
constructor() {
this.baseUrl = 'https://id-y2mate.com';
}

async search(url) {
const requestData = new URLSearchParams({
k_query: url,
k_page: 'home',
hl: '',
q_auto: '0'
});

const requestHeaders = {
'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
'Accept': '*/*',
'X-Requested-With': 'XMLHttpRequest'
};

try {
const response = await axios.post(`${this.baseUrl}/mates/analyzeV2/ajax`, requestData, {
headers: requestHeaders
});

const responseData = response.data;
console.log(responseData);
return responseData;
} catch (error) {
if (error.response) {
console.error(`HTTP error! status: ${error.response.status}`);
} else {
console.error('Axios error: ', error.message);
}
}
}

async convert(videoId, key) {
const requestData = new URLSearchParams({
vid: videoId,
k: key
});

const requestHeaders = {
'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
'Accept': '*/*',
'X-Requested-With': 'XMLHttpRequest',
'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
'Referer': `${this.baseUrl}/youtube/${videoId}`
};

try {
const response = await axios.post(`${this.baseUrl}/mates/convertV2/index`, requestData, {
headers: requestHeaders
});

const responseData = response.data;
console.log(responseData);
return responseData;
} catch (error) {
if (error.response) {
console.error(`HTTP error! status: ${error.response.status}`);
} else {
console.error('Axios error: ', error.message);
}
}
}

async play(url) {
let { links, vid, title } = await this.search(url);
let video = {}, audio = {};
let thumbnail = `https://i.ytimg.com/vi/${vid}/0.jpg`

for (let i in links.mp4) {
let input = links.mp4[i];
let { fquality, dlink } = await this.convert(vid, input.k);
video[fquality] = {
size: input.q,
url: dlink
};
}

for (let i in links.mp3) {
let input = links.mp3[i];
let { fquality, dlink } = await this.convert(vid, input.k);
audio[fquality] = {
size: input.q,
url: dlink
};
}

return { 
developer: 'SuryaDev',
id: vid, 
title: title, 
thumbnail: thumbnail, 
video: video["360"].url, 
audio: audio["128"].url
};
}
}

async function y2mate(link) {
const ytdl = new Ytdl();
const result = await ytdl.play(link);
return result
}

module.exports = {
obfus,
alquran,
instagramdl,
tiktokSearch,
tiktokInfo,
jarak,
snackvideo,
cobalt,
snapsave,
getVidWm,
tiktokdl,
ssweb,
stickersearch,
nickff,
nickml,
y2mate
}