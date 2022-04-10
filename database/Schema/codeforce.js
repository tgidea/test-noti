const mongoose = require('mongoose')
const  subSchema = new mongoose.Schema({
    client: String,
    subscripton: Object
});

const subscriptionName = mongoose.model('codeforces',subSchema);

module.exports = subscriptionName;