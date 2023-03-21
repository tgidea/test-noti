const mongoose = require('mongoose');
const Channel = require('../schema/channels');

const addendpoint = async (channel, endpoint, req, res) => {
    try {
        const subscribe = await Channel.findOneAndUpdate({
            channelName : channel, "subscription.endpoint":{$ne : endpoint}
        },{
            $push:{"subscription" : {endpoint:endpoint}}
        },{
            upsert:false,new:true,
        })
        if(!subscribe)res.status(400).send({"result":"Already Subscribed"});
        else res.status(200).send({"result":"subscribed successfully"});
    }
    catch (err) {
        console.log(err, 'channel not found');
        res.status(400).send({ "result": "Channel not found" });
    }
}
module.exports = addendpoint;