const router = require('express').Router();
const Acreator = require('../schema/creatorInfo');
const ChannelList = require('../schema/channels');
const path = require('path');
var FCM = require('fcm-node');

const { response } = require('express');
const rasta = path.join(__dirname, '../', 'config.env');
require('dotenv').config({ path: rasta });
var serverKey = `${process.env.SERVER_KEY}`;

router.post('/sendnoti', async (req, res) => {
    try {
        let { message, password, channel } = req.body;
        channel = channel.toLowerCase();
        console.log(message, password, channel);

        const userData = await Acreator.findOne({ channel });

        if (userData.password == password) {
            const channelInfo = await ChannelList.findOne({ "channelName": channel });
            const subscriptionList = channelInfo.subscription.map(current => {
                return current.endpoint
            });
            send(subscriptionList, `${channel}: ${message}`);
            return res.status(200).send({ "result": "Sended" })
        }
        else {
            return res.status(400).send({ "result": "Channel and password not matched" });
        }
    }
    catch (err) {
        console.log(err);
        console.log('Error in sendnotifiction');
        res.status(400).send({ "result": "Invalid channel" });
    }
})
function send(regTokens, response) {
    var fcm = new FCM(serverKey);
    var message = {
        registration_ids: regTokens,
        notification: {
            title: 'My Update',
            body: `${response}`,
            icon: "https://cdn-icons-png.flaticon.com/512/5278/5278658.png",
        },
               
    };
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!" + err);
        }
        else {
            console.log(response);
        }
    });
}

module.exports = router;