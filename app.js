const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client")));
const Schema = require('./schema');
const SchemaModel = require('./schemaModel');
const conn = require('./connection');
const axios = require('axios');
const atCoderDataUpdate = require('./dataUpdate/atcoder');
const codechefDataUpdate = require('./dataUpdate/codechef');
const codeforcesDataUpdate = require('./dataUpdate/codeforces');
const codeforcesNotification = require('./functions/codeforces');
const codechefNotification = require('./functions/codechef');

require('dotenv').config({ path: __dirname + '/config.env' });
const private_keys = process.env.PRIVATE_KEY;
const public_keys = 'BIVj4YrGKo27YGVRf4oGmWEuQmKP3RU4-hpqYgiOA1euhIxTGww0tRira53W00qOunrM_6jimqHlKL3eKLZ2GQo';

webpush.setVapidDetails('mailto:gyanexplode@gmail.com', public_keys, private_keys);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'))
})
app.post('/subscribe', (req, res) => {
    const subscription = req.body.subscription;
    const name = req.body.name.toString().toLowerCase().trim();

    if (name.length > 0) {
        SchemaModel(`${name}`, JSON.stringify(subscription));
        res.status(200).json({ "result": "success" });
    }
    else {
        res.status(400).json({ "result": "unsuccess" });
    }
})

app.post('/unsubscribe', async (req, res) => {
    const name = req.body.name.toString().toLowerCase().trim();
    if (name.length > 0) {
        try {
            const deleted = await Schema.deleteOne({ "client": `${name}` });
            if (deleted.deletedCount > 0) {
                res.status(200).send({ "result": "success" })
            }
            else {
                res.status(400).send({ "result": "unsuccess" })
            }
        }
        catch (err) {
            console.log(err);
            res.send({ "result": "Some error occured" });
        }
    }
})

async function runThis(text) {
    const list = await Schema.find();
    for (var i = 0; i < list.length; i++) {
        const data2 = JSON.parse(list[i].subscripton);
        const payload = JSON.stringify({ title: `${text}`, image: "https://thumbs.dreamstime.com/b/business-woman-sending-sms-email-marketing-business-woman-sending-sms-email-marketing-using-mobile-phone-118223999.jpg" });
        webpush.sendNotification(data2, payload).catch(err => console.error(err));
    }
}
let prevTime = 0;
app.get('/notify/:data', (req, res) => {
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
        try {
            await axios('https://myupdates.herokuapp.com/');
        }
        catch (err) {
            console.log(err);
        }
        atCoderDataUpdate();
        codechefDataUpdate();
        codeforcesDataUpdate();
        setInterval(async () => {
            console.log('Update function');
            try {
                await axios('https://myupdates.herokuapp.com/');
            }
            catch (err) {
                console.log(err);
            }
            atCoderDataUpdate();
            codechefDataUpdate();
            codeforcesDataUpdate();
        }, 180000)
    }
    catch (err) {
        console.log(err);
    }
}

callingFun();


function timeToAlert() {
    console.log('in time to alert');
    codeforcesNotification();
    codechefNotification();
}


const alertFun=function(){
    console.log('alert fun activate');
    timeToAlert();
    setTimeout(function(){
        console.log('setTimeout complete');
        alertFun();
    },600000)
}
alertFun();


const port = process.env.PORT || 5001;
app.listen(port, () => console.log('Server started'));