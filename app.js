const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client")));
const Schema = require('./schema/schema');
const expSchema = require('./schema/list_schema');
const Acreator = require('./schema/creatorInfo');
const SchemaModel = require('./schema/schemaModel');
const dynamicSchema = require('./schema/dynamicCollection');
const conn = require('./connection');
const axios = require('axios');
const atCoderDataUpdate = require('./dataUpdate/atcoder');
const codechefDataUpdate = require('./dataUpdate/codechef');
const codeforcesDataUpdate = require('./dataUpdate/codeforces');
const codeforcesNotification = require('./functions/codeforces');
const codechefNotification = require('./functions/codechef');
const addendpoint = require('./functions/addEndpoint');
const { channel } = require('diagnostics_channel');


require('dotenv').config({ path: __dirname + '/config.env' });
const private_keys = process.env.PRIVATE_KEY;
const public_keys = 'BIVj4YrGKo27YGVRf4oGmWEuQmKP3RU4-hpqYgiOA1euhIxTGww0tRira53W00qOunrM_6jimqHlKL3eKLZ2GQo';

webpush.setVapidDetails('mailto:gyanexplode@gmail.com', public_keys, private_keys);

const staticPath = path.join(__dirname, '/client');
app.set('view engine', 'ejs');
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'))
})
app.post('/subscribe', (req, res) => {
    
    const subscription = req.body.subscription;
    const channel = req.body.channel.toString().toLowerCase().trim()+'1s'; 
    console.log(req.body.subscription);   
    if (channel.length > 2) {
        addendpoint(channel,subscription,req,res);
    }
    else {
        res.status(400).json({ "result": "Please fill carefully" });
    }
})

app.post('/unsubscribe', async (req, res) => {
    const chanenl = req.body.channel.toString().toLowerCase().trim() + '1s';
    if (channel.length > 2) {
        try {
            // const deleted = await Schema.deleteOne({ "client": `${name}` });
            // if (deleted.deletedCount > 0) {
            //     res.status(200).send({ "result": "success" })
            // }
            // else {
            //     res.status(400).send({ "result": "unsuccess" })
            // }
        }
        catch (err) {
            console.log(err);
            res.send({ "result": "Some error occured" });
        }
    }
})

app.post('/create', async (req, res) => {
    try {
        const channel = req.body.channel.toString().toLowerCase().trim() + '1s';
        const password = req.body.password.toString();
        console.log(channel, password);
        const document = new Acreator({
            channel,
            password
        })
        await document.save();
        dynamicSchema(channel);
        res.status(200).send({ "result": "okk" });
    }
    catch (err) {
        console.log("this name is already taken");
        res.status(400).send({ "result": 'This name is already taken' });
    }
})
app.post('/sendnoti', async (req, res) => {
    try {
        const message = req.body.message.toString();
        const password = req.body.password.toString();
        const realChannel = req.body.channel.toString().toLowerCase();
        const channel = realChannel + '1s';
        console.log(message, password, channel);

        const userData = await Acreator.findOne({ channel });
        var Temp;
        if (userData.password == password) {
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
                                console.log('InnerMost', err);
                                return res.status(400).send({ "result": "This channel not found" });
                            }
                        }
                        const list = await Temp.find();
                        // console.log(list);
                        runThis(list,message,realChannel);
                    }
                    else {
                        return res.status(400).send({ "result": "Channel not found" })
                    }
                })
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
async function runThis(list , text , channel) {
    // const list = await Schema.find();
    console.log(list[0].subscription);
    for (var i = 0; i < list.length; i++) {                        
        const data3 =(JSON.parse(list[i].subscription));        
        const payload = JSON.stringify({ title: `${channel}:${text}`, image: "https://thumbs.dreamstime.com/b/business-woman-sending-sms-email-marketing-business-woman-sending-sms-email-marketing-using-mobile-phone-118223999.jpg" });
        webpush.sendNotification(data3, payload).catch(err => console.error(err));
    }
}
let prevTime = 0;
app.get('/notify01/:data', (req, res) => {
    const data = req.params.data;
    if (Date.now() - prevTime > 10000) {
        prevTime = Date.now();
        runThis(data);
        res.send('Send successfully');
    }
    else {
        res.send(`please try after ${(Date.now() - prevTime) / 1000} seconds`);
    }
})

//Calling json file creater function
const callingFun = async () => {
    try {
        atCoderDataUpdate();
        codechefDataUpdate();
        codeforcesDataUpdate();
        setInterval(async () => {
            atCoderDataUpdate();
            codechefDataUpdate();
            codeforcesDataUpdate();
        }, 180000)       
    }
    catch (err) {
        console.log(err);
    }
}

// callingFun();


function timeToAlert() {
    codeforcesNotification();
    codechefNotification();
}

app.get('/check01', async (req, res) => {
    try {
        timeToAlert();
        res.send("okkkk");
    }
    catch (err) {
        res.send("error");
        console.log(err);
    }
})
const alertFun = function () {
    // console.log('alert fun activate');
    timeToAlert();
    setTimeout(function () {
        console.log('setTimeout complete');
        alertFun();
    }, 600000)
}
// alertFun();


const port = process.env.PORT || 5001;
app.listen(port, () => console.log('Server started'));