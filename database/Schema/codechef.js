const mongoose = require('mongoose')
const  subSchema = new mongoose.Schema({
    client: String,
    subscripton: Object
});

const subscriptionName = mongoose.model('codechefs',subSchema);

module.exports = subscriptionName;