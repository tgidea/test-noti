const mongoose = require('mongoose');
const expSchema = require('../schema/list_schema');

const addendpoint = async (channel, subscription, req, res) => {
    try {
        var Temp;        
        mongoose.connection.db.listCollections({ name: channel })
            .next(async (err, info) => {
                if (info) {
                    try {
                        Temp = mongoose.model(channel);
                    }
                    catch (err) {
                        try {
                            Temp = mongoose.model(channel, expSchema);
                        }
                        catch (err) {
                            console.log('innermost addendpoint', err);
                            return res.status(400).send({ "result": "This channel not found" });
                        }
                    }
                    try {
                        const document = new Temp({
                            "name" : "Test",
                            "subscription" : JSON.stringify(subscription)
                        })
                        console.log(await document.save());
                        return res.status(200).send({ "result": "Successfully subscribed" })
                    }
                    catch (err) {   
                        console.log(err,'aaaaa');                     
                        return res.status(400).send({ "result": "You are already subscribed to this channel" })
                    }
                }
                else {
                    console.log(err,'fdsfasd');
                    return res.status(400).send({ "result": "Channel not found" })
                }
            })
    }
    catch (err) {
        console.log(err, 'asdf');
        res.status(400).send({ "result": "Channel not found" });
    }
}
module.exports = addendpoint;