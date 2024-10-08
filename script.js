const { basename } = require('path');
const { Router } = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const yts = require('yt-search')
const cekNIK = require('./ceknik.js');
const MechaAI = require('./mecha-ai.js');
const ttslide = require('./tiktokslide.js');
const YT = new (require('./youtube.js'));
const {
obfus,
alquran,
instagramdl,
tiktokSearch,
tiktokInfo,
jarak,
snackvideo,
cobalt,
snapsave,
tiktokdl,
ssweb,
stickersearch,
nickff,
nickml,
y2mate
} = require('./scrape.js');
const {
createUser,
deleteUser,
checkUser,
getUsername,
getPassword,
changePassword,
changeAccessUser,
getNumber,
findIndexNumber,
updateNumber,
addNumber,
delNumber,
resetNumber,
listUsers
} = require('./MongoDB/function.js');
const {
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
} = require('./games.js');

const router = new Router();
let notice = new Map();
let noticevip = new Map();
let nikData = [];
let loginData = [];

const listApi = [
{
name: 'api/ceknik',
method: 'GET',
status: true
},
{
name: 'api/jarak',
method: 'GET',
status: true
},
{
name: 'api/snapsave',
method: 'GET',
status: true
},
{
name: 'api/tiktok',
method: 'GET',
status: true
},
{
name: 'api/instagram',
method: 'GET',
status: true
},
{
name: 'api/tiktoksearch',
method: 'GET',
status: false
},
{
name: 'api/tiktokinfo',
method: 'GET',
status: false
},
{
name: 'api/tiktokuserpost',
method: 'GET',
status: true
},
{
name: 'api/tiktokslide',
method: 'GET',
status: true
},
{
name: 'api/ssweb',
method: 'GET',
status: true
},
{
name: 'api/mlstalk',
method: 'GET',
status: true
},
{
name: 'api/ffstalk',
method: 'GET',
status: true
},
{
name: 'api/stickersearch',
method: 'GET',
status: true
},
{
name: 'api/play',
method: 'GET',
status: false
},
{
name: 'api/ytmp3',
method: 'GET',
status: false
},
{
name: 'api/ytmp4',
method: 'GET',
status: false
},
{
name: 'api/y2mate',
method: 'GET',
status: false
},
{
name: 'api/alquran',
method: 'GET',
status: true
},
{
name: 'api/obfus',
method: 'POST',
status: true
},
{
name: 'games/asahotak',
method: 'GET',
status: true
},
{
name: 'games/caklontong',
method: 'GET',
status: true
},
{
name: 'games/family100',
method: 'GET',
status: true
},
{
name: 'games/kuis',
method: 'GET',
status: true
},
{
name: 'games/siapakahaku',
method: 'GET',
status: true
},
{
name: 'games/susunkata',
method: 'GET',
status: true
},
{
name: 'games/tebakanime',
method: 'GET',
status: true
},
{
name: 'games/tebakbendera',
method: 'GET',
status: true
},
{
name: 'games/tebakgambar',
method: 'GET',
status: true
},
{
name: 'games/tebakheroml',
method: 'GET',
status: true
},
{
name: 'api/tebakheroml',
method: 'GET',
status: true
},
{
name: 'games/tebakkalimat',
method: 'GET',
status: true
},
{
name: 'games/tebakkata',
method: 'GET',
status: true
},
{
name: 'games/tebakkimia',
method: 'GET',
status: true
},
{
name: 'games/tebaklagu',
method: 'GET',
status: true
},
{
name: 'games/tebaklirik',
method: 'GET',
status: true
},
{
name: 'games/tebaklogo',
method: 'GET',
status: true
},
{
name: 'api/levelup',
method: 'GET',
status: true
},
{
name: 'api/level',
method: 'POST',
status: true
},
{
name: 'api/mechaai',
method: 'GET',
status: true
},
]

const mess = {
error: (res, msg) => {
return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: msg
})
},
success: (msg) => {
return {
status: 200,
creator: 'SuryaDev',
message: msg
}
}
}

/* NOTIFIKASI SCRIPT FREE */
router.get('/notif/send', async (req, res) => {
const { number, name, version } = req.query;
if (!number) return mess.error(res, 'number parameter is required');
if (!name) return mess.error(res, 'name parameter is required');
if (isNaN(number)) return mess.error(res, 'invalid number!');
const datenow = timezone();
if (notice.has(number)) {
let user = notice.get(number);
user.name = name;
user.version = version ? version : '9.1.7';
user.date = datenow.date;
user.time = datenow.time;
user.connect += 1;
} else {
notice.set(number, {
number: number,
name: name,
version: version ? version : '9.1.7',
date: datenow.date,
time: datenow.time,
connect: 1
});
}
res.json({
status: 200, 
creator: 'SuryaDev',
result: notice.get(number)
});
})

router.get('/notif/get', (req, res) => {
const data = Array.from(notice.values());
res.json({
status: 200, 
creator: 'SuryaDev',
result: data
});
});

router.get('/notif/reset', (req, res) => {
if (notice.size == 0) return mess.error(res, 'Empty data.')
notice.clear();
res.json({
status: 200, 
creator: 'SuryaDev',
message: 'data reset successfully.'
});
});

router.get('/notif/data', (req, res) => {
const data = Array.from(notice.values());
let newData = data.reduce((acc, curr) => {
let findIndex = acc.findIndex(item => item.number === curr.number);
if (findIndex !== -1) {
acc[findIndex].total += 1;
} else {
acc.push({ ...curr, total: 1 });
}
return acc;
}, []);
res.json({
status: 200, 
creator: 'SuryaDev',
result: newData,
runtime: runtime(process.uptime())
});
});

/* NOTIFIKASI SCRIPT VIP */
router.get('/notif-vip/send', async (req, res) => {
const { number, name } = req.query;
if (!number) return mess.error(res, 'number parameter is required');
if (!name) return mess.error(res, 'name parameter is required')
if (isNaN(number)) return mess.error(res, 'invalid number!')
const datenow = timezone();
const username = await getUsername(number);
try {
var index = username != '' ? await findIndexNumber(username, number) : 0;
} catch {
var index = 0;
}
if (noticevip.has(number)) {
let user = noticevip.get(number);
user.name = name;
user.username = username ? username : false;
user.numberto = index > 0 ? index : false;
user.date = datenow.date;
user.time = datenow.time;
user.connect += 1;
} else {
noticevip.set(number, {
number: number,
name: name,
username: username ? username : false,
numberto: index > 0 ? index : false,
date: datenow.date,
time: datenow.time,
connect: 1
});
}
await updateNumber(number, name);
res.json({
status: 200, 
creator: 'SuryaDev',
result: noticevip.get(number)
});
})

router.get('/notif-vip/get', (req, res) => {
const data = Array.from(noticevip.values());
res.json({
status: 200, 
creator: 'SuryaDev',
result: data
});
});

router.get('/notif-vip/reset', (req, res) => {
if (noticevip.size == 0) return mess.error(res, 'Empty data.')
noticevip.clear();
res.json({
status: 200, 
creator: 'SuryaDev',
message: 'data reset successfully.'
});
});

router.get('/notif-vip/data', (req, res) => {
const data = Array.from(noticevip.values());
let newData = data.reduce((acc, curr) => {
let findIndex = acc.findIndex(item => item.number === curr.number);
if (findIndex !== -1) {
acc[findIndex].total += 1;
} else {
acc.push({ ...curr, total: 1 });
}
return acc;
}, []);
res.json({
status: 200, 
creator: 'SuryaDev',
result: newData,
runtime: runtime(process.uptime())
});
});

router.get('/api/ceknik', async (req, res) => {
const { nik } = req.query;
if (!nik) return mess.error(res, 'nik parameter is required');
if (isNaN(nik)) return mess.error(res, 'invalid nik!');
const result = cekNIK(nik)
if (result.status) nikData.push(result.data);
res.json(result);
})

router.get('/nik/get', (req, res) => {
const data = nikData;
res.json({
status: 200, 
creator: 'SuryaDev',
result: data
});
});

router.get('/api/jarak', async (req, res) => {
const { from, to } = req.query;
if (!from) return mess.error(res, 'from parameter is required');
if (!to) return mess.error(res, 'to parameter is required');
const result = await jarak(from, to)
res.json(result)
})

router.get('/api/snapsave', async (req, res) => {
const { url } = req.query;
if (!url) return mess.error(res, 'url parameter is required');
const result = await snapsave(url)
res.json(result)
})

router.get('/api/snackvideo', async (req, res) => {
const { url } = req.query;
if (!url) return mess.error(res, 'url parameter is required');
const result = await snackvideo(url)
res.json(result)
})

router.get('/api/cobalt', async (req, res) => {
const { url } = req.query;
if (!url) return mess.error(res, 'url parameter is required');
const result = await cobalt(url)
res.json(result)
})

router.get('/api/tiktok', async (req, res) => {
const { url } = req.query;
if (!url) return mess.error(res, 'url parameter is required');
const result = await tiktokdl(url)
res.json(result)
})

router.get('/api/instagram', async (req, res) => {
const { url } = req.query;
if (!url) return mess.error(res, 'url parameter is required');
const result = await instagramdl(url)
res.json(result)
})

router.get('/api/tiktoksearch', async (req, res) => {
const { query } = req.query;
if (!query) return mess.error(res, 'query parameter is required');
const result = await tiktokSearch(query)
res.json(result)
})

router.get('/api/tiktokinfo', async (req, res) => {
const { url } = req.query;
if (!url) return mess.error(res, 'url parameter is required');
const result = await tiktokInfo(url)
res.json(result)
})

router.get('/api/tiktokuserpost', async (req, res) => {
const { username } = req.query;
if (!username) return mess.error(res, 'username parameter is required');
async function tiktokUserPost(user) {
return new Promise(async (resolve, reject) => {
const result = [];
const res = await fetch("https://www.tikwm.com/api/user/posts", {
method: "POST",
body: new URLSearchParams({
unique_id: `@${user.replace(/@/gi, "")}`,
hd: 1,
cursor: 0,
}),
}).then((v) => v.json());
const posts = res.data.videos;
for (let {
title,
duration,
play_count,
origin_cover,
create_time,
digg_count,
share_count,
download_count,
collect_count,
comment_count,
play,
wmplay,
music_info,
video_id,
author,
} of posts) {
result.push({
title,
duration,
link: `https://www.tiktok.com/@${author.unique_id}/video/${video_id}`,
origin_cover,
views: play_count,
like: digg_count,
comment: comment_count,
share: share_count,
download: download_count,
saved: collect_count || null,
create_time,
no_watermark: play,
watermark: wmplay,
music: music_info,
});
}
await resolve(result);
});
}
const result = await tiktokUserPost(username)
res.json(result)
})

router.get('/api/tiktokslide', async (req, res) => {
const { url } = req.query;
if (!url) return mess.error(res, 'url parameter is required');
async function tiktokSlide(url) {
return new Promise(async (resolve, reject) => {
try {
const origin = "https://ttsave.app/";
/**
 * @type {RequestInit}
 */
const options = {
method: "POST",
headers: {
Accept: "application/json, text/plain, */*",
"Accept-Encoding": "gzip, deflate, br, zstd",
"Content-Type": "application/json",
Origin: origin,
Referer: `${origin}/en/slide`,
"Sec-Fetch-Mode": "cors",
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
// Cookie:
// "ttsaveapp_session=eyJpdiI6IkgyRkswa2hpb0pRR21WMFRRS3BwL3c9PSIsInZhbHVlIjoiQUU3SVk0VnkzWHdtKzVjdllKWjZSVForRHRDVi9NK01GeU5wTUZQYWs5eTc5M0RqYzVpQXhrWlNHRWs5SjE0N1dZQ1FqQU5UNGNYOGFaRGE2bXNKWGJiWThhZGlsUlZSVDlHbzVybkFPcldsdHdESzYwMDZidkwzdXVuRWhrSTkiLCJtYWMiOiI4M2YzN2UxZDFhZmQ2YjgwMTJkOTI0MzNkZWJhOGQ0ZWJmOWI0MjBmMmU0Y2E4MDMyODdiNmI3OTY5YzZjYWVmIiwidGFnIjoiIn0%3D;",
},
body: JSON.stringify({
language_id: "1",
query: url,
}),
};
const res = await fetch(`${origin}/download`, options).then((v) => v.text());
const $ = cheerio.load(res);
const data = {
author: "",
username: "",
profile: "",
caption: "",
views: "0",
likes: "0",
comment: "0",
save: "0",
share: "0",
music: "",
thumbnail: "",
slides: [],
link: url,
authorLink: "",
};
const download = $("div.items-center");
const attr = $(download).find("div.gap-2").children("div");
const slides = $(download).find("div#button-download-ready");
data.author = $(download).find("h2.font-extrabold.text-xl.text-center").text().trim();
data.username = $(download).find("a[title]").text().trim();
data.authorLink = $(download).find("a[title]").attr("href");
data.caption = $(download).find("a[title] + p").text().trim();
data.views = attr.eq(0).find("span").text().trim() || "0";
data.likes = attr.eq(1).find("span").text().trim() || "0";
data.comment = attr.eq(2).find("span").text().trim() || "0";
data.save = attr.eq(3).find("span").text().trim() || "0";
data.share = attr.eq(4).find("span").text().trim() || "0";
data.music = $(download).find("div.mt-5 > span").text().trim() || "";
$(slides).children("div").each((i, el) => {
data.slides.push($(el).find("img").attr("src"));
});
data.profile = $(slides).find('a[type="profile"]').attr("href");
data.thumbnail = $(slides).find('a[type="cover"]').attr("href");
resolve(data);
} catch (e) {
reject(e);
}
});
}
const result = await tiktokSlide(url)
res.json(result)
})

router.get('/api/ssweb', async (req, res) => {
const { url } = req.query;
if (!url) return mess.error(res, 'url parameter is required');
const result = await ssweb(url)
res.json(result)
})

router.get('/api/mlstalk', async (req, res) => {
const { id, zone } = req.query;
if (!id) return mess.error(res, 'id parameter is required');
if (!zone) return mess.error(res, 'zone parameter is required');
const result = await nickml(id, zone)
res.json(result)
})

router.get('/api/ffstalk', async (req, res) => {
const { id } = req.query;
if (!id) return mess.error(res, 'id parameter is required');
const result = await nickff(id)
res.json(result)
})

router.get('/api/stickersearch', async (req, res) => {
const { query } = req.query;
if (!query) return mess.error(res, 'query parameter is required');
const result = await stickersearch(query)
res.json(result)
})

router.get('/api/play', async (req, res) => {
const { query, type } = req.query;
if (!query) return mess.error(res, 'query parameter is required');
if (!type) return mess.error(res, 'type parameter is required');
const play = async (title, type = 'audio') => {
const json = (type === 'audio') ? await YT.audio(title) : await YT.video(title)
return json
}
const result = await play(query, type)
res.json(result)
})

router.get('/api/ytmp3', async (req, res) => {
const { url } = req.query;
if (!url) return mess.error(res, 'url parameter is required');
const result = await YT.getmp3(url)
res.json(result)
})

router.get('/api/ytmp4', async (req, res) => {
const { url } = req.query;
if (!url) return mess.error(res, 'url parameter is required');
const result = await YT.getmp4(url)
res.json(result)
})

router.get('/api/y2mate', async (req, res) => {
const { url } = req.query;
if (!url) return mess.error(res, 'url parameter is required');
const result = await y2mate(url)
res.json(result)
})

router.get('/api/alquran', async (req, res) => {
const { surah, ayat } = req.query;
if (!surah) return mess.error(res, 'surah parameter is required');
if (isNaN(surah)) return mess.error(res, 'invalid number surah!');
if (!ayat) return mess.error(res, 'ayat parameter is required');
if (isNaN(ayat)) return mess.error(res, 'invalid number ayat!');
const result = await alquran(surah, ayat)
res.json(result)
})

router.post('/api/obfus', async (req, res) => {
try {
const { content, difficulty } = req.body; 
if (!content) return mess.error(res, 'content body is required');
if (!difficulty) return mess.error(res, 'difficulty body is required');
const result = await obfus(content, difficulty);
res.json(result);
} catch (error) {
res.status(500).send({ error: error.message });
}
});

router.get('/database/createuser', async (req, res) => {
const { username, password } = req.query;
if (!username) return mess.error(res, 'username parameter is required');
if (!password) return mess.error(res, 'password parameter is required');
const result = await createUser(username, password)
res.json(result)
})

router.get('/database/deleteuser', async (req, res) => {
const { username } = req.query;
if (!username) return mess.error(res, 'username parameter is required');
const result = await deleteUser(username)
res.json(result)
})

router.get('/database/checkuser', async (req, res) => {
const { username } = req.query;
if (!username) return mess.error(res, 'username parameter is required');
const result = await checkUser(username)
res.json(result)
})

router.get('/database/getusername', async (req, res) => {
const { number } = req.query;
if (!number) return mess.error(res, 'number parameter is required');
if (isNaN(number)) return mess.error(res, 'invalid number!');
const result = await getUsername(number)
res.json({
status: 200,
creator: 'SuryaDev',
username: result
})
})

router.get('/database/getpassword', async (req, res) => {
const { username } = req.query;
if (!username) return mess.error(res, 'username parameter is required');
const result = await getPassword(username)
res.json(result)
})

router.get('/database/changepassword', async (req, res) => {
const { username, password } = req.query;
if (!username) return mess.error(res, 'username parameter is required');
if (!password) return mess.error(res, 'password parameter is required');
const result = await changePassword(username, password)
res.json(result)
})

router.get('/database/changeaccessuser', async (req, res) => {
const { username, status } = req.query;
if (!username) return mess.error(res, 'username parameter is required');
if (!status) return mess.error(res, 'status parameter is required');
const boolean = status === 'true' ? true : status === 'false' ? false : null;
const result = await changeAccessUser(username, boolean)
res.json(result)
})

router.get('/database/addnumber', async (req, res) => {
const { username, number, logintime } = req.query;
if (!username) return mess.error(res, 'username parameter is required');
if (!number) return mess.error(res, 'number parameter is required');
if (!logintime) return mess.error(res, 'logintime parameter is required');
let object = {
number: number,
logintime: logintime,
botname: '',
lastconnect: '',
totalconnect: 0
}
const result = await addNumber(username, object)
res.json(result)
})

router.get('/database/updatenumber', async (req, res) => {
const { number, botname, totalconnect } = req.query;
if (!number) return mess.error(res, 'number parameter is required');
if (!botname) return mess.error(res, 'botname parameter is required');
const result = await updateNumber(number, botname, totalconnect)
res.json(result)
})

router.get('/database/delnumber', async (req, res) => {
const { username, number } = req.query;
if (!username) return mess.error(res, 'username parameter is required');
if (!number) return mess.error(res, 'number parameter is required');
const result = await delNumber(username, number)
res.json(result)
})

router.get('/database/getnumber', async (req, res) => {
const { username } = req.query;
if (!username) return mess.error(res, 'username parameter is required');
const result = await getNumber(username)
res.json(result)
})

router.get('/database/checklimit', async (req, res) => {
const { username } = req.query;
if (!username) return mess.error(res, 'username parameter is required');
const response = await getNumber(username)
if (response.status == 400) return res.json({
status: 200,
creator: 'SuryaDev',
data: {
number: 0,
limit: false
}
})
const number = response.data;
let statuses = false;
if (Array.isArray(number) && number.length >= 10) {
statuses = true;
};
let result = {
status: 200,
creator: 'SuryaDev',
data: {
number: number.length,
limit: statuses
}
};
res.json(result)
})

router.get('/database/resetnumber', async (req, res) => {
const { username } = req.query;
if (!username) return mess.error(res, 'username parameter is required');
const result = await resetNumber(username)
res.json(result)
})

router.get('/database/listusers', async (req, res) => {
const result = await listUsers();
if (result.status == 400) return res.json([])
res.json(result.data)
})

router.get('/database/allnumbers', async (req, res) => {
const response = await listUsers();
if (response.status == 400) return res.json([])
// Mengumpulkan semua data nomor dari data pengguna
let allNumbers = [];
response.data.forEach(user => {
user.number.forEach(item => {
allNumbers.push(item.number);
});
});
res.json(allNumbers)
})

/*router.get('/database/users', async (req, res) => {
const data = require('./database.json')
let result = {
status: 200,
creator: 'SuryaDev',
data: data.users
}
res.json(result)
})

router.get('/database/send', async (req, res) => {
const { username, botname, logindata } = req.query;
if (!username) return mess.error(res, 'username parameter is required'
});
if (!botname) return mess.error(res, 'botname parameter is required'
});
if (!logindata) return mess.error(res, 'logindata parameter is required'
});
// mengubah string JSON menjadi array
const dataArray = decodeURIComponent(logindata);
// menggabungkan array baru ke dalam objek data
const newData = {
username: username,
botname: botname,
logindata: JSON.parse(dataArray)
};
loginData.push(newData)
let result = {
status: 200,
creator: 'SuryaDev',
message: 'data send successfully.'
};
res.json(result)
})

router.get('/database/get', async (req, res) => {
const data = loginData;
let result = {
status: 200,
creator: 'SuryaDev',
data: data
}
res.json(result)
})

router.get('/database/delete', (req, res) => {
if (loginData.length == 0) return res.status(400).json({
status: 400, 
creator: 'SuryaDev',
message: 'Empty data.'
});
loginData = [];
res.json({
status: 200, 
creator: 'SuryaDev',
message: 'data deleted successfully.'
});
});*/

/* GAMES API BY SURYADEV */
router.get('/games/asahotak', async (req, res) => {
const result = AsahOtak()
res.json(result)
})

router.get('/games/caklontong', async (req, res) => {
const result = CakLontong()
res.json(result)
})

router.get('/games/family100', async (req, res) => {
const result = Family100()
res.json(result)
})

router.get('/games/kuis', async (req, res) => {
const result = Kuis()
res.json(result)
})

router.get('/games/siapakahaku', async (req, res) => {
const result = SiapakahAku()
res.json(result)
})

router.get('/games/susunkata', async (req, res) => {
const result = SusunKata()
res.json(result)
})

router.get('/games/tebakanime', async (req, res) => {
const result = TebakAnime()
res.json(result)
})

router.get('/games/tebakbendera', async (req, res) => {
const result = TebakBendera()
res.json(result)
})

router.get('/games/tebakgambar', async (req, res) => {
const result = TebakGambar()
res.json(result)
})

router.get('/games/tebakheroml', async (req, res) => {
const { language } = req.query;
if (!language) return mess.error(res, 'language parameter is required');
const result = TebakHeroml(language)
res.json(result)
})

router.get('/api/tebakheroml', async (req, res) => {
const { language } = req.query;
if (!language) return mess.error(res, 'language parameter is required');
try {
const result = TebakHeroml(language)
const response = await axios({
method: 'GET',
url: result.audio,
responseType: 'arraybuffer'
});
res.json({
status: true,
creator: 'SuryaDev',
name: result.name,
audio: response.data
})
} catch (error) {
res.json({
status: false,
creator: 'SuryaDev',
message: String(error)
})
}
})

router.get('/games/tebakkalimat', async (req, res) => {
const result = TebakKalimat()
res.json(result)
})

router.get('/games/tebakkata', async (req, res) => {
const result = TebakKata()
res.json(result)
})

router.get('/games/tebakkimia', async (req, res) => {
const result = TebakKimia()
res.json(result)
})

router.get('/games/tebaklagu', async (req, res) => {
const result = TebakLagu()
res.json(result)
})

router.get('/games/tebaklirik', async (req, res) => {
const result = TebakLirik()
res.json(result)
})

router.get('/games/tebaklogo', async (req, res) => {
const result = TebakLogo()
res.json(result)
})

router.get('/api/levelup', async (req, res) => {
const { currentxp, userlevel, requiredxp, username, profile } = req.query;
if (!currentxp) return mess.error(res, 'currentxp parameter is required');
if (!userlevel) return mess.error(res, 'userlevel parameter is required');
if (!requiredxp) return mess.error(res, 'requiredxp parameter is required');
if (!username) return mess.error(res, 'username parameter is required');
try {
const avatar = profile ? profile : 'https://telegra.ph/file/0a70ee52eb457fbcc2b92.jpg'
const canvacord = require('canvacord')
const rank = new canvacord.Rank()
.setAvatar(avatar)
.setCurrentXP(Number(currentxp))
.setLevel(Number(userlevel), "RANK", true)
.setRank(Number(userlevel), "LEVEL", true)
.setLevelColor("#2B2E35", "#2B2E35")
.setRankColor("#FFFFFF", "#6636E5")
.setRequiredXP(Number(requiredxp))
.setStatus("streaming")
.setProgressBar("#6636E5", "COLOR")
.setProgressBarTrack("#FFFFFF")
.setUsername(username)
.setDiscriminator('0001')
.setFontSize(1.5)
rank.build().then(image => {
return res.json({
status: 200,
creator: 'SuryaDev',
buffer: image
})
})
} catch (error) {
res.json({
status: 400,
creator: 'SuryaDev',
message: String(error)
})
}
})

router.post('/api/level', async (req, res) => {
const { currentxp, userlevel, requiredxp, username, profile } = req.body;
if (!currentxp) return mess.error(res, 'currentxp body is required');
if (!userlevel) return mess.error(res, 'userlevel body is required');
if (!requiredxp) return mess.error(res, 'requiredxp body is required');
if (!username) return mess.error(res, 'username body is required');
if (!profile) return mess.error(res, 'username body is required');
try {
const canvacord = require('canvacord')
const rank = new canvacord.Rank()
.setAvatar(profile)
.setCurrentXP(Number(currentxp))
.setLevel(Number(userlevel), "RANK", true)
.setRank(Number(userlevel), "LEVEL", true)
.setLevelColor("#2B2E35", "#2B2E35")
.setRankColor("#FFFFFF", "#6636E5")
.setRequiredXP(Number(requiredxp))
.setStatus("streaming")
.setProgressBar("#6636E5", "COLOR")
.setProgressBarTrack("#FFFFFF")
.setUsername(username)
.setDiscriminator('0001')
.setFontSize(1.5)
rank.build().then(image => {
return res.json({
status: 200,
creator: 'SuryaDev',
buffer: image
})
})
} catch (error) {
res.json({
status: 400,
creator: 'SuryaDev',
message: String(error)
})
}
});

router.get('/api/mechaai', async (req, res) => {
const { question, username } = req.query;
if (!question) return mess.error(res, 'question parameter is required');
if (!username) return mess.error(res, 'username parameter is required');
const result = await MechaAI(question, username)
res.json(result)
})

router.get('/api/yts', async (req, res) => {
const { query } = req.query;
if (!query) return mess.error(res, 'query parameter is required');
async function search(query) {
try {
const response = await yts(query);
const result = response.videos.map((video) => ({
title: video.title,
url: video.url,
thumbnail: video.image,
duration: {
seconds: video.seconds,
timestamp: video.timestamp
},
views: video.views,
publish: video.ago,
channel: video.author.name || 'N/A',
description: video.description || 'N/A'
}));
return {
status: true,
developer: 'SuryaDev',
result
};
} catch (err) {
return {
status: true,
developer: 'SuryaDev',
message: String(err)
}
}
}
const result = await search(query)
res.json(result)
})

router.get('/api/youtube', async (req, res) => {
const { url } = req.query;
if (!url) return mess.error(res, 'url parameter is required');
const MediaInfo = {
url: '',
size: 0,
quality: '',
formattedSize: ''
};

const VideoDetails = {
title: '',
url: '',
thumbnail: '',
duration: {
seconds: 0,
timestamp: ''
},
views: 0,
publish: ''
};

const YouTubeResult = {
title: '',
thumbnail: '',
duration: '',
video: {},
audio: {}
};

async function youtube(url) {
try {
const form = new FormData();
form.append("url", url);

const { data } = await axios.post("https://www.aiodownloader.in/wp-json/aio-dl/video-data/", form, {
headers: form.getHeaders()
});

const result = {
title: data.title,
thumbnail: data.thumbnail,
duration: data.duration,
video: {
url: data.medias[0].url,
size: data.medias[0].size,
quality: data.medias[0].quality,
formattedSize: data.medias[0].formattedSize
},
audio: {
url: data.medias[5].url,
size: data.medias[5].size,
quality: data.medias[5].quality,
formattedSize: data.medias[5].formattedSize
}
};

return {
status: true,
developer: 'SuryaDev',
result
};
} catch (err) {
return {
status: true,
developer: 'SuryaDev',
message: String(err)
}
}
}
const result = await youtube(url)
res.json(result)
})

router.get('/api/listapi', async (req, res) => {
const data = listApi.filter(x => x.status)
let result = [];
data.forEach(item => {
result.push({
url: 'suryadev.vercel.app/' + item.name,
method: item.method,
status: item.status ? '✅' : '❌'
})
})
res.json({
status: true,
total: data.length,
data: result
})
})

function timezone () {
const today = new Date();
const date = new Date(today.toLocaleString('en-US', {timeZone: 'Asia/Jakarta'}));
const hours = date.getHours();
const minutes = date.getMinutes();
const day = today.getDate();
const month = today.getMonth() + 1; // perhatikan bahwa bulan dimulai dari 0, maka ditambahkan 1.
const year = today.getFullYear();
// mengambil nama hari dalam bahasa Inggris.
const dayOfWeek = today.toLocaleDateString('id-ID', { weekday: 'long' });
const timeNow = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
return {
date: `${dayOfWeek}, ${day}/${month}/${year}`,
time: `${timeNow} WIB`
}
}

function runtime (seconds) {
seconds = Number(seconds);
var d = Math.floor(seconds / (3600 * 24));
var h = Math.floor(seconds % (3600 * 24) / 3600);
var m = Math.floor(seconds % 3600 / 60);
var s = Math.floor(seconds % 60);
var dDisplay = d > 0 ? d + (d == 1 ? ' hari, ' : ' hari, ') : '';
var hDisplay = h > 0 ? h + (h == 1 ? ' jam, ' : ' jam, ') : '';
var mDisplay = m > 0 ? m + (m == 1 ? ' menit, ' : ' menit, ') : '';
var sDisplay = s > 0 ? s + (s == 1 ? ' detik' : ' detik') : '';
return dDisplay + hDisplay + mDisplay + sDisplay;
}

function makeid (length) {
let result = '';
let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let charactersLength = characters.length;
for (let i = 0; i < length; i++) {
result += characters.charAt(Math.floor(Math.random() * charactersLength));
}
return result;
}

module.exports = router;