const mongoose = require('mongoose')
const  subSchema = new mongoose.Schema({
    "channel": {
        type:String,
        unique:true
    },
    "password": String
});

const acreator = mongoose.model('acreator',subSchema);

module.exports = acreator;