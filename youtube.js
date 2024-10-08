const ytdl = require('ytdl-core');
const yts = require('yt-search');
const decode = require('html-entities').decode;
const { Writable } = require('stream');
const { Buffer } = require('buffer');
const creator = 'SuryaDev'

module.exports = class Youtube {
humansize = str => {
function getsize(first, max) {
var pow = Math.pow(10, max || 0);
return Math.round(first * pow) / pow;
}
if (str < 1024) {
return str + ' B';
} else {
if (str < 1048576) {
return getsize(str / 1024, 1) + ' KB';
} else {
if (str < 1073741824) {
return getsize(str / 1048576, 1) + ' MB';
} else {
return str < 1099511627776 ? getsize(str / 1073741824, 1) + ' GB' : getsize(str / 1099511627776, 1) + ' TB';
}
}
}
return '';
};
getId = url => {
var result = url.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|shorts\/|v=)([^#\&\?]*).*/);
return result[2];
};
getInfo = async url => {
const data = await yts({
videoId: this.getId(url)
});
return {
title: decode(data.title),
thumbnail: data.thumbnail,
duration: data.seconds + ' (' + data.timestamp + ')',
channel: data.author.name,
views: Number(data.views).toLocaleString().replace(/,/g, '.'),
publish: data.uploadDate + ' (' + data.ago + ')'
};
};
getmp3 = (url) => new Promise(async (resolve, reject) => {
try {
// Mendapatkan stream dari ytdl
const stream = ytdl(url, {
quality: 'highestaudio',
filter: 'audioonly'
});

// Menginisialisasi buffer kosong
let buffer = Buffer.from([]);

// Mengumpulkan data chunk ke dalam buffer
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]);
}

const options = await this.getInfo(url);
resolve({
creator: creator,
status: true,
...options,
data: {
filename: options.title + '.mp3',
quality: '128kbps',
size: this.humansize(buffer.length),
extension: 'mp3',
buffer: buffer
}
});
} catch (error) {
console.log(error);
const result = {
creator: creator,
status: false,
msg: error.message
};
resolve(result);
}
});
getmp4 = (url) => new Promise(async (resolve, _0x26e29d) => {
try {
let chunks = [];
const writableStream = new Writable({
write(chunk, encoding, callback) {
chunks.push(chunk);
callback();
}
});
await ytdl(url, {
quality: 'highestvideo',
filter: 'videoandaudio'
}).pipe(writableStream).on('finish', async () => {
const buffer = Buffer.concat(chunks);
const options = await this.getInfo(url);
resolve({
creator: creator,
status: true,
...options,
data: {
filename: options.title + '.mp4',
quality: '480p',
size: this.humansize(buffer.length),
extension: 'mp4',
buffer: buffer
}
});
}).on('error', (err) => {
const result = {
creator: creator,
status: false,
msg: err
};
reject(result);
});
} catch (error) {
console.log(error);
const result = {
creator: creator,
status: false,
msg: error.message
};
resolve(result);
}
});
audio = query => {
return new Promise(async (resolve, reject) => {
try {
let search = await yts(query);
let data = search.all.find(x => x.seconds < 3600);
const result = await this.getmp3('https://www.youtube.com/watch?v=' + data.videoId);
resolve(result);
} catch (error) {
console.log(error);
const result = {
creator: creator,
status: false,
msg: error.message
};
resolve(result);
}
});
};
video = query => {
return new Promise(async (resolve, reject) => {
try {
let search = await yts(query);
let data = search.all.find(x => x.seconds < 3600);
const result = await this.getmp4('https://www.youtube.com/watch?v=' + data.videoId);
resolve(result);
} catch {
const result = {
creator: creator,
status: false
};
resolve(result);
}
});
};
};