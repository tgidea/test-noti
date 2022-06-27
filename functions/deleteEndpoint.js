const mongoose = require('mongoose');
const expSchema = require('../schema/list_schema');

const deleteEndpoint = async (channel, subscription, req, res) => {
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
                            console.log('innermost deleteendpoint', err);
                            return res.status(400).send({ "result": "This channel not found" });
                        }
                    }
                    try {
                        const document = await Temp.deleteOne({ subscription });
                        console.log(document);
                        if (document.deletedCount > 0) {
                            return res.status(200).send({ "result": `Hope you come back soon &#129310;` })
                        }
                        else{
                            throw("not subscribed");
                        }
                    }
                    catch (err) {
                        console.log('not subscribed');
                        return res.status(400).send({ "result": "You are not subscribed to this channel " })
                    }
                }
                else {
                    console.log(err, 'bbbbb');
                    return res.status(400).send({ "result": "Channel not found" })
                }
            })
    }
    catch (err) {
        console.log(err, 'channel not found');
        res.status(400).send({ "result": "Channel not found" });
    }
}
module.exports = deleteEndpoint;