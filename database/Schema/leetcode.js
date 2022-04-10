const mongoose = require('mongoose')
const  subSchema = new mongoose.Schema({
    client: String,
    subscripton: Object
});

const subscriptionName = mongoose.model('leecodes',subSchema);

module.exports = subscriptionName;