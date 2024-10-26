const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path')
const ejs = require('ejs')
const apiRoutes = require('./script.js')
const { connectMongoDB } = require('./MongoDB/mongodb.js')

const app = express();
let database = [];

// settings
app.set('port', process.env.PORT || 4000);
connectMongoDB();

// middlewares
app.enable('trust proxy');
app.set('json spaces', 2)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(cors())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.get('/', (req, res) => {
res.render('home')
});

app.get('/messages', (req, res) => {
const data = database;
res.json({ status: 200, result: data });
});

app.post('/messages', (req, res) => {
const { number, name, message } = req.body;
if (!number) {
return res.status(400).send('Number is required');
};
if (!name) {
return res.status(400).send('Name is required');
};
if (!message) {
return res.status(400).send('Message is required');
};
let obj = {
number: number.replace(/[^0-9]/g, '') + '@s.whatsapp.net',
name: name,
message: message
}
database.push(obj);
res.redirect('/');
});

app.post('/send', (req, res) => {
const { number, name, message } = req.body;
if (!message) return res.status(400).send('Message is required');
let obj = {
number: number.replace(/[^0-9]/g, '') + '@s.whatsapp.net',
name: name,
message: message
}
database.push(obj);
res.redirect('/');
});

app.get('/delete/messages', (req, res) => {
database = []
res.redirect('/');
});

app.use('/', apiRoutes)

// starting the server
app.listen(app.get('port'), async () => {
console.log(`Server on port ${app.get('port')}`);
});