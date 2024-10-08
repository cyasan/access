const axios = require('axios');

function pickRandom (arr) {
return arr[Math.floor(Math.random() * arr.length)]
}

function AsahOtak () {
const data = require('./games/asahotak.json');
const result = pickRandom(data.result)
return {
creator: data.creator,
soal: result.soal,
jawaban: result.jawaban
}
}

function CakLontong () {
const data = require('./games/caklontong.json');
const result = pickRandom(data.result)
return {
creator: data.creator,
soal: result.soal,
jawaban: result.jawaban,
deskripsi: result.deskripsi
}
}

function Family100 () {
const data = require('./games/family100.json');
const result = pickRandom(data.result)
return {
creator: data.creator,
soal: result.soal,
jawaban: result.jawaban
}
}

function Kuis () {
const data = require('./games/kuis.json');
const result = pickRandom(data.result)
return {
creator: data.creator,
soal: result.soal,
jawaban: result.jawaban
}
}

function SiapakahAku () {
const data = require('./games/siapakahaku.json');
const result = pickRandom(data.result)
return {
creator: data.creator,
soal: result.soal,
jawaban: result.jawaban
}
}

function SusunKata () {
const data = require('./games/susunkata.json');
const result = pickRandom(data.result)
return {
creator: data.creator,
soal: result.soal,
jawaban: result.jawaban,
tipe: result.tipe
}
}

function TebakAnime () {
const data = require('./games/tebakanime.json');
const result = pickRandom(data.result)
return {
creator: data.creator,
name: result.name,
image: result.image,
desc: result.desc,
url: result.url
}
}

function TebakBendera () {
const data = require('./games/tebakbendera.json');
const result = pickRandom(data.result)
return {
creator: data.creator,
soal: result.soal,
jawaban: result.jawaban
}
}

function TebakGambar () {
const data = require('./games/tebakgambar.json');
const result = pickRandom(data.result)
return {
creator: data.creator,
image: result.image,
jawaban: result.jawaban,
deskripsi: result.deskripsi
}
}

function TebakHeroml (language = 'id') {
if (!['id', 'en'].includes(language)) language = 'id';
const data = require('./games/tebakheroml.json');
const result = data.result.filter(x => x.language === language);
const random = pickRandom(result);
return {
creator: data.creator,
name: random.name,
language: random.language,
audio: random.audio
}
}

function TebakKalimat () {
const data = require('./games/tebakkalimat.json');
const result = pickRandom(data.result)
return {
creator: data.creator,
soal: result.soal,
jawaban: result.jawaban
}
}

function TebakKata () {
const data = require('./games/tebakkata.json');
const result = pickRandom(data.result)
return {
creator: data.creator,
soal: result.soal,
jawaban: result.jawaban
}
}

function TebakKimia () {
const data = require('./games/tebakkimia.json');
const result = pickRandom(data.result)
return {
creator: data.creator,
soal: result.soal,
jawaban: result.jawaban
}
}

function TebakLagu () {
const data = require('./games/tebaklagu.json');
const result = pickRandom(data.result)
return {
creator: data.creator,
name: result.name,
artist: result.artist,
audio: result.audio
}
}

function TebakLirik () {
const data = require('./games/tebaklirik.json');
const result = pickRandom(data.result)
return {
creator: data.creator,
soal: result.soal,
jawaban: result.jawaban
}
}

function TebakLogo () {
const data = require('./games/tebaklogo.json');
const result = pickRandom(data.result)
return {
creator: data.creator,
image: result.image,
name: result.name
}
}

module.exports = {
AsahOtak,
CakLontong,
Family100,
Kuis,
SiapakahAku,
SusunKata,
TebakAnime,
TebakBendera,
TebakGambar,
TebakHeroml,
TebakKalimat,
TebakKata,
TebakKimia,
TebakLagu,
TebakLirik,
TebakLogo
}