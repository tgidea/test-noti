const mongoose = require('mongoose');
const Channel = require('../schema/channels');

const deleteEndpoint = async (channel, token, req, res) => {
    try {
        Channel.updateOne({"channelName": `${channel}`, "subscription.endpoint": `${token}` },
            {
                $pull: { subscription: { endpoint: `${token}` } }
            }, (err) => {
                if (err) {
                    return res.status(400).send({"result":"Something went wrong"});
                } else {
                    return res.status(200).send({ "result": "Unsubscribed succesfully" });
                }
            });        
    }
    catch (err) {
        console.log(err, 'channel not found');
        res.status(400).send({ "result": "Something went wrong" });
    }
}
module.exports = deleteEndpoint;