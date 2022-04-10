const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path= require('path');
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"client")));
const Schema=require('./schema');
const SchemaModel=require('./schemaModel');
const conn=require('./connection');
const atCoderDataUpdate = require('./dataUpdate/atcoder');
const codechefDataUpdate = require('./dataUpdate/codechef');
const codeforcesDataUpdate = require('./dataUpdate/codeforces');
const codeforcesNotification = require('./functions/codeforces');
const codechefNotification = require('./functions/codechef');

require('dotenv').config({ path: __dirname + '/config.env' });
const private_keys = process.env.PRIVATE_KEY;
const public_keys='BIVj4YrGKo27YGVRf4oGmWEuQmKP3RU4-hpqYgiOA1euhIxTGww0tRira53W00qOunrM_6jimqHlKL3eKLZ2GQo';
  
webpush.setVapidDetails('mailto:gyanexplode@gmail.com', public_keys,private_keys);

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'client/index.html'))
})
app.post('/subscribe', (req, res)=>{
    const subscription = req.body.subscription;
    res.status(201).json({})
    const payload = JSON.stringify({title: 'first Push Notification learning by me' });
    SchemaModel('name', JSON.stringify(subscription));
})

async function runThis(text){
    const list=await Schema.find();
    for(var i=0;i<list.length;i++){
        const data2 = JSON.parse(list[i].subscripton);
        const payload = JSON.stringify({title: `${text}` });
        webpush.sendNotification(data2, payload).catch(err=> console.error(err));
    }
}
app.get('/notify/:data',(req,res)=>{
    const data=req.params.data;
    runThis(data);
    return res.status(200).json();
})

//Calling json file creater function
const callingFun = async ()=> {
    try {
        atCoderDataUpdate();
        codechefDataUpdate();
        codeforcesDataUpdate();
        setInterval(function () {
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
    console.log('in time to alert');
    codechefNotification();
    codeforcesNotification();
}

timeToAlert();
setInterval(function () {
    timeToAlert();
}, 180000);


const port=process.env.PORT || 5001;
app.listen(port,()=>console.log('Server started'));