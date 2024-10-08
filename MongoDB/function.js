const { User } = require('./schema');
const PHONENUMBER_MCC = require('./phonenumber-mcc.json')

function datenow () {
const today = new Date();
const date = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
const hours = date.getHours();
const minutes = date.getMinutes();
const day = today.getDate();
const month = today.getMonth() + 1;
const year = today.getFullYear();
const timeNow = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
return `${day}/${month}/${year}, ${timeNow}`;
}

async function createUser(username, password) {
if (!(username && password)) return {
status: 400,
creator: 'SuryaDev',
message: 'username & password parameter is required.'
};
if (username.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid username, maximum 15 characters.'
};
if (password.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid password, maximum 15 characters.'
};
let obj = {
username,
password,
access: true,
number: []
}
try {
const users = await User.find({});
if (users && users.some(item => item.username === username)) return {
status: 400,
creator: 'SuryaDev',
message: 'This username already in database'
};
await User.create(obj);
return {
status: 200,
creator: 'SuryaDev',
message: 'User created successfully.'
};
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: 'Error creating user: ' + String(error)
};
}
}
module.exports.createUser = createUser;

async function deleteUser(username) {
if (!username) return {
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required.'
};
if (username.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid username, maximum 15 characters.'
};
try {
const user = await User.deleteOne({
username: username
});
if (user.deletedCount === 1) {
return {
status: 200,
creator: 'SuryaDev',
message: 'User removed successfully'
};
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
};
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: 'Error removing user: ' + String(error)
};
}
}
module.exports.deleteUser = deleteUser;

async function checkUser(username) {
if (!username) return {
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required.'
};
if (username.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid username, maximum 15 characters.'
};
let users = await User.findOne({
username: username
});
if (users) {
let result = {
id: users._id,
username: users.username,
password: users.password,
access: users.access,
number: users.number
}
return {
status: 200,
creator: 'SuryaDev',
data: result
};
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
};
}
}
module.exports.checkUser = checkUser;

async function changeAccessUser(username, statuses) {
if (!(username && statuses)) return {
status: 400,
creator: 'SuryaDev',
message: 'username & statuses parameter is required.'
};
if (username.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid username, maximum 15 characters.'
};
if (typeof statuses !== 'boolean') return {
status: 400,
creator: 'SuryaDev',
message: 'statuses must be a boolean true or false'
};
try {
let user = await User.findOne({
username: username
});
if (user) {
if (user.access === statuses) return {
status: 400,
creator: 'SuryaDev',
message: 'Access already this.'
};
user.access = statuses;
await user.save();
return {
status: 200,
creator: 'SuryaDev',
message: `Successfully changed access on username ${username} to ${statuses}`
};
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
};
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: 'Error fetching user: ' + String(error)
};
}
}
module.exports.changeAccessUser = changeAccessUser;

async function getUsername(number) {
if (!number) return {
status: 400,
creator: 'SuryaDev',
message: 'number parameter is required.'
};
if (isNaN(number)) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, phone number must be numbers.'
};
if (number.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, maximum 15 digits.'
};
if (!Object.keys(PHONENUMBER_MCC).some(v => String(number).startsWith(v))) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, start with country code.'
};
let username = '';
try {
const userData = await User.find({});
if (userData.length > 0) {
userData.forEach(user => {
user.number.forEach(item => {
if (item.number === number) {
username = user.username;
}
});
});
}
return username;
} catch (e) {
console.log(e);
return username;
}
}
module.exports.getUsername = getUsername;

async function getPassword(username) {
if (!username) return {
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required.'
};
if (username.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid username, maximum 15 characters.'
};
try {
let user = await User.findOne({
username: username
});
if (!user) return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
};
return {
status: 200,
creator: 'SuryaDev',
data: user.password
};
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: 'Error fetching user: ' + String(error)
};
}
}
module.exports.getPassword = getPassword;

async function changePassword(username, password) {
if (!(username && password)) return {
status: 400,
creator: 'SuryaDev',
message: 'username & password parameter is required.'
};
if (username.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid username, maximum 15 characters.'
};
if (password.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid password, maximum 15 characters.'
};
try {
let user = await User.findOne({
username: username
});
if (user) {
if (user.password === password) return {
status: 400,
creator: 'SuryaDev',
message: 'Password already this.'
};
user.password = password;
await user.save();
return {
status: 200,
creator: 'SuryaDev',
message: `Successfully changed password on username ${username}`
};
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
};
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: 'Error fetching user: ' + String(error)
};
}
}
module.exports.changePassword = changePassword;

async function getNumber(username) {
if (!username) return {
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required.'
};
if (username.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid username, maximum 15 characters.'
};
try {
let user = await User.findOne({
username: username
});
if (!user) return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
};
return {
status: 200,
creator: 'SuryaDev',
data: user.number
};
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: 'Error fetching user: ' + String(error)
};
}
}
module.exports.getNumber = getNumber;

async function findIndexNumber(username, number) {
if (!(username && number)) return {
status: 400,
creator: 'SuryaDev',
message: 'username & number parameter is required.'
};
if (username.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid username, maximum 15 characters.'
};
if (isNaN(number)) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, phone number must be numbers.'
};
if (number.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, maximum 15 digits.'
};
if (!Object.keys(PHONENUMBER_MCC).some(v => String(number).startsWith(v))) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, start with country code.'
};
try {
let user = await User.findOne({
username: username
});
if (!user) return {
status: false,
creator: 'SuryaDev',
message: 'User data not found.'
};
const index = user.number.findIndex(x => x.number === number);
const data = index ? (index + 1) : 0;
return isNaN(data) ? 0 : data;
} catch (error) {
return 0;
}
}
module.exports.findIndexNumber = findIndexNumber;

async function updateNumber(number, botname, connect) {
if (!(number && botname && connect)) return {
status: 400,
creator: 'SuryaDev',
message: 'number & botname & connect parameter is required.'
};
if (isNaN(number)) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, phone number must be numbers.'
};
if (number.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, maximum 15 digits.'
};
if (!Object.keys(PHONENUMBER_MCC).some(v => String(number).startsWith(v))) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, start with country code.'
};
try {
const username = await getUsername(number)
const user = await User.findOne({
username: username
});
if (user) {
let numbers = [...user.number];
let timenow = datenow();
numbers.forEach((item, index) => {
if (numbers.length > 0 && item.number === number) {
let totalconnect = (typeof connect !== 'undefined') ? connect : item.totalconnect + 1;
numbers[index] = {
number: item.number,
logintime: item.logintime,
botname: botname || 'WhatsApp Bot',
lastconnect: timenow,
totalconnect: parseInt(totalconnect)
};
}
});
user.number = numbers;
await user.save();
return {
status: 200,
creator: 'SuryaDev',
message: `Successfully update number from username ${username}`
};
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
};
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: 'Error fetching user: ' + String(error)
};
}
}
module.exports.updateNumber = updateNumber;

async function addNumber(username, options = {
number: '',
logintime: '',
botname: '',
lastconnect: '',
totalconnect: 0
}) {
if (!username) return {
status: 400,
creator: 'SuryaDev',
message: 'username parameter is required.'
};
if (username.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid username, maximum 15 characters.'
};
try {
const user = await User.findOne({
username: username
});
if (user) {
if (user.number.length >= 10) return {
status: 400,
creator: 'SuryaDev',
message: 'This username has reached the phone number limit.'
};
const { number, logintime } = options;
if (!(number && logintime)) return {
status: 400,
creator: 'SuryaDev',
message: 'number & logintime parameter is required.'
};
if (isNaN(number)) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, phone number must be numbers.'
};
if (number.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, maximum 15 digits.'
};
if (!Object.keys(PHONENUMBER_MCC).some(v => String(number).startsWith(v))) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, start with country code.'
};
if (user.number && user.number.some(item => item.number === number)) return {
status: 400,
creator: 'SuryaDev',
message: 'This number already in database.'
};
let numbers = [...user.number, options]
user.number = numbers;
await user.save();
return {
status: 200,
creator: 'SuryaDev',
message: `Successfully added number to username ${username}`
};
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
};
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: `Error extending number: ${error.message}`
};
}
}
module.exports.addNumber = addNumber;

async function delNumber(username, number) {
try {
if (!(username && number)) return {
status: 400,
creator: 'SuryaDev',
message: 'username & number parameter is required.'
};
if (username.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid username, maximum 15 characters.'
};
if (isNaN(number)) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, phone number must be numbers.'
};
if (number.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, maximum 15 digits.'
};
if (!Object.keys(PHONENUMBER_MCC).some(v => String(number).startsWith(v))) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, start with country code.'
};
const user = await User.findOne({
username: username
});
if (user) {
let numbers = [...user.number];
// Temukan indeks data dengan number
const indexToRemove = numbers.findIndex(item => item.number === number);
if (indexToRemove === -1) return {
status: 400,
creator: 'SuryaDev',
message: 'This number not in database.'
};
// Jika indeks ditemukan, lakukan splice untuk menghapus data dari array
if (indexToRemove !== -1) {
numbers.splice(indexToRemove, 1);
}
user.number = numbers;
await user.save();
return {
status: 200,
creator: 'SuryaDev',
message: `Successfully delete number to username ${username}`
};
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
};
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: `Error extending number: ${error.message}`
};
}
}
module.exports.delNumber = delNumber;

async function resetNumber(username, number) {
try {
if (!(username && number)) return {
status: 400,
creator: 'SuryaDev',
message: 'username & number parameter is required.'
};
if (username.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid username, maximum 15 characters.'
};
if (isNaN(number)) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, phone number must be numbers.'
};
if (number.length > 15) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, maximum 15 digits.'
};
if (!Object.keys(PHONENUMBER_MCC).some(v => String(number).startsWith(v))) return {
status: 400,
creator: 'SuryaDev',
message: 'Invalid number, start with country code.'
};
const user = await User.findOne({
username: username
});
if (user) {
user.number = [];
await user.save();
return {
status: 200,
creator: 'SuryaDev',
message: `Successfully reset number from username ${username}`
};
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'User data not found.'
};
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: `Error extending number: ${error.message}`
};
}
}
module.exports.resetNumber = resetNumber;

async function listUsers() {
try {
const users = await User.find({});
if (users.length > 0) {
let result = users.map(user => ({
username: user.username,
password: user.password,
access: user.access,
number: user.number
}));
return {
status: 200,
creator: 'SuryaDev',
data: result
};
} else {
return {
status: 400,
creator: 'SuryaDev',
message: 'No users found'
};
}
} catch (error) {
return {
status: 400,
creator: 'SuryaDev',
message: `Error retrieving users: ${error.message}`
};
}
}
module.exports.listUsers = listUsers;