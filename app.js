const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const fs = require('fs');
const conn = require('./connection');

const atCoderDataUpdate = require('./controller/platform/updateHandler/atcoder');
const codechefDataUpdate = require('./controller/platform/updateHandler/codechef');
const codeforcesDataUpdate = require('./controller/platform/updateHandler/codeforces');
const tpcUpdate = require('./controller/platform/updateHandler/tpc');
const leetcodeUpdate = require('./controller/platform/updateHandler/leetcode');
const codeforcesNotification = require('./controller/platform/notificationHandler/codeforces');
const codechefNotification = require('./controller/platform/notificationHandler/codechef');
const channel = require('./routes/channel');
const message = require('./routes/message');
const notification = require('./routes/notification');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client")));

//Voluntary application server identity

require('dotenv').config({ path: __dirname + '/config.env' });
const private_keys = process.env.PRIVATE_KEY;
const public_keys = 'BIVj4YrGKo27YGVRf4oGmWEuQmKP3RU4-hpqYgiOA1euhIxTGww0tRira53W00qOunrM_6jimqHlKL3eKLZ2GQo';

webpush.setVapidDetails('mailto:gyanexplode@gmail.com', public_keys, private_keys);

const staticPath = path.join(__dirname, './client');
app.use('/css',express.static(staticPath));
app.use('/js', express.static(staticPath));
app.use('/json', express.static(staticPath));

app.set('view engine','ejs');
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {res.render('home')})
app.get('/platform/:current',(req,res)=>{
    const current = req.params.current.toUpperCase();
    if(current == 'ATCODER')res.render('platform', {"platform":current,"end":"jp"});
    else res.render('platform', {"platform":current,"end":"com"});
})
app.get('/help',(req,res)=>{res.render('help')})
app.get('/service_create',(req,res)=>{res.render('service_create')});
app.get('/service',(req,res)=>{res.render('service')});
app.get('/subscribe',(req,res)=>{res.render('subscribe')});

app.use('/channel',channel);
app.use('/message',message);
app.use('/notification', notification);

//Calling json file creater function
const callingFun = async () => {
    try {
        atCoderDataUpdate();
        codechefDataUpdate();
        codeforcesDataUpdate();
        leetcodeUpdate();        
        setInterval(async () => {
            atCoderDataUpdate();
            codechefDataUpdate();
            codeforcesDataUpdate();
            leetcodeUpdate();
        }, 180000);
        setInterval(async()=>{
            tpcUpdate();            
        },1500000);       
    }
    catch (err) {
        console.log(err);
    }
}

function timeToAlert() {
    codeforcesNotification();
    codechefNotification();
}
const alertFun = function () {    
    timeToAlert();
    setTimeout(function () {
        alertFun();
    }, 600000)    
}
callingFun();
alertFun();

app.get('*',function(req,res){
    try{
    res.status(400).send('Page not available');
    }
    catch(err){
        console.log(err);
    }
})

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server started at ${5001}`));