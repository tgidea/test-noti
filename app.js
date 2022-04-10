const express = require('express');
const mongoose = require('mongoose');
const connection = require('./connection');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client")));
const Codechef = require('./database/siteDocument/codechef');
const Codeforces = require('./database/siteDocument/codeforces');
const Leetcode = require('./database/siteDocument/leetcode');
const Atcoder = require('./database/siteDocument/atcoder');

const codeforcesNotification = require('./functions/codeforces');
const codechefNotification = require('./functions/codechef');

const atCoderDataUpdate = require('./dataUpdate/atcoder');
const codechefDataUpdate = require('./dataUpdate/codechef');
const codeforcesDataUpdate = require('./dataUpdate/codeforces');

require('dotenv').config({ path: __dirname + '/config.env' });
const private_keys = process.env.PRIVATE_KEY;
const public_keys = 'BIVj4YrGKo27YGVRf4oGmWEuQmKP3RU4-hpqYgiOA1euhIxTGww0tRira53W00qOunrM_6jimqHlKL3eKLZ2GQo';

webpush.setVapidDetails('mailto:gyanexplode@gmail.com', public_keys, private_keys);

app.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '/client/subscription.html'))
    }
    catch (err) {
        console.log(err);
        res.write('<h1>Error occur from our side.</h1>');
    }
})

app.post('/subscribe', async (req, res) => {
    try {
        const subscrip = req.body.subscription;
        const site = req.body.Site;
        console.log(req.body);
        //send status 201 for the request
        res.status(201).json({})
        const payload = JSON.stringify({ title: 'first Push Notification learning by me' });
        if (site == 'codechefs') {
            console.log('app codechef')
            Codechef('name of the client', JSON.stringify(subscrip));
        }
        else if (site == 'codeforces') {
            Codeforces('name of the client', JSON.stringify(subscrip));
        }
        else if (site == 'leetcodes') {
            Leetcode('name of the client', JSON.stringify(subscrip));
        }
        else if (site == 'atcoders') {
            Atcoder('name of the client', JSON.stringify(subscrip));
        }
    }
    catch (err) {
        console.log(err);
    }
})

//Calling json file creater function
// const callingFun = async ()=> {
//     try {
//         atCoderDataUpdate();
//         codechefDataUpdate();
//         codeforcesDataUpdate();
//         setInterval(function () {
//             atCoderDataUpdate();
//             codechefDataUpdate();
//             codeforcesDataUpdate();
//         }, 180000)
//     }
//     catch (err) {
//         console.log(err);
//     }
// }
// callingFun();

function timeToAlert() {
    console.log('in time to alert');
    codechefNotification();
    codeforcesNotification();
}

function notificationSend() {
    try {

        const d = new Date();
        var timeIsBeing936 = new Date(`${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} 01:01:00 PM`).getTime()
        var currentTime = new Date().getTime()
        var subtractMilliSecondsValue = timeIsBeing936 - currentTime;
        console.log('time left to call caleer funtion ', subtractMilliSecondsValue);
        if (subtractMilliSecondsValue < 3600000 && subtractMilliSecondsValue >= -600000) {
            console.log('subtrac milli sexond approved');
            setTimeout(timeToAlert, subtractMilliSecondsValue);
        }

        timeIsBeing936 = new Date(`${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} 06:59:00 PM`).getTime()
        currentTime = new Date().getTime()
        subtractMilliSecondsValue = timeIsBeing936 - currentTime;
        if (subtractMilliSecondsValue < 3600000 && subtractMilliSecondsValue >= -600000) {
            console.log('subtrac milli sexond approved 22');
            setTimeout(timeToAlert, subtractMilliSecondsValue);
        }
    }
    catch (err) {
        console.log(err);
    }
}


notificationSend();
setInterval(function () {
    notificationSend();
}, 3600000);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log('Server started'));