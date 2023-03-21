const mongoose = require('mongoose')
const channelSchema = new mongoose.Schema({
    channelName : {
        type : String,
        required: true,
        unique : true
    },
    subscription: [{
        "endpoint" : String,   
    }]
});
const Channels = mongoose.model('channelList',channelSchema);
module.exports = Channels;