const mongoose = require('mongoose');

/*
mongodb+srv://mechabot:ri8K7VdhjQZnI6Zy@cluster0.tuagtkn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mechabot
ri8K7VdhjQZnI6Zy
114.10.20.77/32
*/

let MongoUrl = 'mongodb+srv://suryadev:1aD3CW1eq82GCJRc@cluster0.tuagtkn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// let MongoUrl = 'mongodb://tess:koclok890@ac-whbyauf-shard-00-00.cblvjgh.mongodb.net:27017,ac-whbyauf-shard-00-01.cblvjgh.mongodb.net:27017,ac-whbyauf-shard-00-02.cblvjgh.mongodb.net:27017/?ssl=true&replicaSet=atlas-p4jmck-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'

function connectMongoDB() {
mongoose.connect(MongoUrl, { 
useNewUrlParser: true, 
useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
console.log('Succes connect to MONGODB ✅');
});
};

module.exports.connectMongoDB = connectMongoDB;