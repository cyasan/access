const { basename } = require('path');
const { Router } = require('express');
const axios = require('axios');
const cekNIK = require('./ceknik.js');
const ttslide = require('./tiktokslide.js');
const webp2mp4 = require('./webp2mp4.js');
const YT = new (require('./youtube.js'));
const {
jarak,
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
let database_free = [];
let freeData = [];
let database_vip = [];
let vipData = [];
let pluginsData = [];
let pairingData = [];
let nikData = [];
let loginData = [];

/* NOTIFIKASI SCRIPT BIASA */
router.get('/notif/send', async (req, res) => {
const { number, name } = req.query;
if (!number) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'number parameter is required'
});
if (!name) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'name parameter is required'
});
if (isNaN(number)) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'invalid number!'
});
const result = {
number: number,
name: name,
date: timezone().date,
time: timezone().time
}
database_free.push(result)
freeData.push(result)
res.json({
status: 200, 
creator: 'SuryaDev',
result: result
});
})

router.get('/notif/get', (req, res) => {
const data = freeData;
res.json({
status: 200, 
creator: 'SuryaDev',
result: data
});
});

router.get('/notif/reset', (req, res) => {
if (freeData.length == 0) return res.status(400).json({
status: 400, 
creator: 'SuryaDev',
message: 'empty data.'
});
freeData = [];
res.json({
status: 200, 
creator: 'SuryaDev',
message: 'data reset successfully.'
});
});

router.get('/notif/data', (req, res) => {
const data = database_free;
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
if (!number) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'number parameter is required'
});
if (!name) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'name parameter is required'
});
if (isNaN(number)) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'invalid number!'
});
const result = {
number: number,
name: name,
date: timezone().date,
time: timezone().time
}
database_vip.push(result);
vipData.push(result);
await updateNumber(number, name);
res.json({
status: 200, 
creator: 'SuryaDev',
result: result
});
})

router.get('/notif-vip/get', (req, res) => {
const data = vipData;
res.json({
status: 200, 
creator: 'SuryaDev',
result: data
});
});

router.get('/notif-vip/reset', (req, res) => {
if (vipData.length == 0) return res.status(400).json({
status: 400, 
creator: 'SuryaDev',
message: 'empty data.'
});
vipData = [];
res.json({
status: 200, 
creator: 'SuryaDev',
message: 'data reset successfully.'
});
});

router.get('/notif-vip/data', (req, res) => {
const data = database_vip;
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

/* FUNCTION SEND DAN GET PLUGINS */
router.get('/plugins/send', async (req, res) => {
const { number, path, code } = req.query;
if (!number) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'number parameter is required'
});
if (isNaN(number)) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'invalid number!'
});
if (!path) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'path parameter is required'
});
if (!code) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'code parameter is required'
});
const result = {
number: number,
date: timezone().date,
time: timezone().time,
path: basename(path),
code: code
}
pluginsData.push(result)
res.json({
status: 200, 
creator: 'SuryaDev',
message: 'data sent successfully'
});
})

router.get('/plugins/get', (req, res) => {
const data = pluginsData;
res.json({
status: 200, 
creator: 'SuryaDev',
result: data
});
});

router.get('/plugins/delete', (req, res) => {
if (pluginsData.length == 0) return res.status(400).json({
status: 400, 
creator: 'SuryaDev',
message: 'empty data.'
});
pluginsData = [];
res.json({
status: 200, 
creator: 'SuryaDev',
message: 'data deleted successfully.'
});
});

/* FUNCTION SEND DAN GET PAIRING CODE */
router.get('/pairing/send', async (req, res) => {
const { number, code } = req.query;
if (!number) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'number parameter is required'
});
if (isNaN(number)) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'invalid number!'
});
if (!code) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'code parameter is required'
});
const result = {
number: number,
date: timezone().date,
time: timezone().time,
code: code
}
pairingData.push(result)
res.json({
status: 200, 
creator: 'SuryaDev',
message: 'data sent successfully'
});
})

router.get('/pairing/get', (req, res) => {
const data = pairingData;
res.json({
status: 200, 
creator: 'SuryaDev',
result: data
});
});

router.get('/pairing/delete', (req, res) => {
if (pairingData.length == 0) return res.status(400).json({
status: 400, 
creator: 'SuryaDev',
message: 'empty data.'
});
/*for (let i = pairingData.length - 1; i >= 0; i--) {
if (pairingData[i].number === number) {
pairingData.splice(i, 1);
}
}*/
pluginsData = [];
res.json({
status: 200, 
creator: 'SuryaDev',
message: 'data deleted successfully.'
})
});

router.get('/api/ceknik', async (req, res) => {
const { nik } = req.query;
if (!nik) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'nik parameter is required'
});
if (isNaN(nik)) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'invalid nik!'
});
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

router.get('/nik/reset', (req, res) => {
if (nikData.length == 0) return res.status(400).json({
status: 400, 
creator: 'SuryaDev',
message: 'empty data.'
});
nikData = [];
res.json({
status: 200, 
creator: 'SuryaDev',
message: 'data reset successfully.'
});
});

router.get('/api/jarak', async (req, res) => {
const { from, to } = req.query;
if (!from) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'from parameter is required'
});
if (!to) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'to parameter is required'
});
const result = await jarak(from, to)
res.json(result)
})

router.get('/api/snapsave', async (req, res) => {
const { url } = req.query;
if (!url) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'url parameter is required'
});
const result = await snapsave(url)
res.json(result)
})

router.get('/api/tiktok', async (req, res) => {
const { url } = req.query;
if (!url) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'url parameter is required'
});
const result = await tiktokdl(url)
res.json(result)
})

router.get('/api/tiktokslide', async (req, res) => {
const { url } = req.query;
if (!url) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'url parameter is required'
});
const result = await ttslide(url)
res.json(result)
})

router.get('/api/ssweb', async (req, res) => {
const { url } = req.query;
if (!url) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'url parameter is required'
});
const result = await ssweb(url)
res.json(result)
})

router.get('/api/mlstalk', async (req, res) => {
const { id, zone } = req.query;
if (!id) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'id parameter is required'
});
if (!zone) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'zone parameter is required'
});
const result = await nickml(id, zone)
res.json(result)
})

router.get('/api/ffstalk', async (req, res) => {
const { id } = req.query;
if (!id) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'id parameter is required'
});
const result = await nickff(id)
res.json(result)
})

router.get('/api/stickersearch', async (req, res) => {
const { query } = req.query;
if (!query) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'query parameter is required'
});
const result = await stickersearch(url)
res.json(result)
})

router.get('/api/play', async (req, res) => {
const { query, type } = req.query;
if (!query) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'query parameter is required'
});
if (!type) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'type parameter is required'
});
const play = async (title, type = 'audio') => {
const json = (type === 'audio') ? await YT.audio(title) : await YT.video(title)
return json
}
const result = await play(query, type)
res.json(result)
})

router.get('/api/ytmp3', async (req, res) => {
const { url } = req.query;
if (!url) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'url parameter is required'
});
const result = await YT.getmp3(url)
res.json(result)
})

router.get('/api/ytmp4', async (req, res) => {
const { url } = req.query;
if (!url) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'url parameter is required'
});
const result = await YT.getmp4(url)
res.json(result)
})

router.get('/api/youtube', async (req, res) => {
const { url } = req.query;
if (!url) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'url parameter is required'
});
const result = await y2mate(url)
res.json(result)
})

router.post('/api/webp2mp4', async (req, res) => {
try {
const { imageBuffer } = req.body; 
if (!imageBuffer) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'imageBuffer body is required'
});
const result = await webp2mp4(imageBuffer);
res.json(result);
} catch (error) {
res.status(500).send({ error: error.message });
}
});

router.get('/database/createuser', async (req, res) => {
const { username, password } = req.query;
if (!username) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required'
});
if (!password) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'password parameter is required'
});
const result = await createUser(username, password)
res.json(result)
})

router.get('/database/deleteuser', async (req, res) => {
const { username } = req.query;
if (!username) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required'
});
const result = await deleteUser(username)
res.json(result)
})

router.get('/database/checkuser', async (req, res) => {
const { username } = req.query;
if (!username) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required'
});
const result = await checkUser(username)
res.json(result)
})

router.get('/database/getusername', async (req, res) => {
const { number } = req.query;
if (!number) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'number parameter is required'
});
if (isNaN(number)) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'invalid number!'
});
const result = await getUsername(number)
res.json({
status: 200,
creator: 'SuryaDev',
username: result
})
})

router.get('/database/getpassword', async (req, res) => {
const { username } = req.query;
if (!username) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required'
});
const result = await getPassword(username)
res.json(result)
})

router.get('/database/changepassword', async (req, res) => {
const { username, password } = req.query;
if (!username) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required'
});
if (!password) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'password parameter is required'
});
const result = await changePassword(username, password)
res.json(result)
})

router.get('/database/changeaccessuser', async (req, res) => {
const { username, status } = req.query;
if (!username) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required'
});
if (!status) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'status parameter is required'
});
const boolean = status === 'true' ? true : status === 'false' ? false : null;
const result = await changeAccessUser(username, boolean)
res.json(result)
})

router.get('/database/addnumber', async (req, res) => {
const { username, number, logintime } = req.query;
if (!username) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required'
});
if (!number) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'number parameter is required'
});
if (!logintime) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'logintime parameter is required'
});
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
if (!number) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'number parameter is required'
});
if (!botname) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'botname parameter is required'
});
const result = await updateNumber(number, botname, totalconnect)
res.json(result)
})

router.get('/database/delnumber', async (req, res) => {
const { username, number } = req.query;
if (!username) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required'
});
if (!number) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'number parameter is required'
});
const result = await delNumber(username, number)
res.json(result)
})

router.get('/database/getnumber', async (req, res) => {
const { username } = req.query;
if (!username) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required'
});
const result = await getNumber(username)
res.json(result)
})

router.get('/database/checklimit', async (req, res) => {
const { username } = req.query;
if (!username) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required'
});
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
if (!username) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required'
});
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
if (!username) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required'
});
if (!botname) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'botname parameter is required'
});
if (!logindata) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'logindata parameter is required'
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
if (!language) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'language parameter is required'
});
const result = TebakHeroml(language)
res.json(result)
})

router.get('/api/tebakheroml', async (req, res) => {
const { language } = req.query;
if (!language) return res.status(400).json({
status: 400,
creator: 'SuryaDev',
message: 'language parameter is required'
});
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