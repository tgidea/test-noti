const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path= require('path');
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"client")));
// const Schema=require('./schema');
// const SchemaModel=require('./schemaModel');
// const conn=require('./connection');
require('dotenv').config({ path: __dirname + '/config.env' });
const private_keys = process.env.PRIVATE_KEY;
const public_keys='BIVj4YrGKo27YGVRf4oGmWEuQmKP3RU4-hpqYgiOA1euhIxTGww0tRira53W00qOunrM_6jimqHlKL3eKLZ2GQo';
  
webpush.setVapidDetails('mailto:gyanexplode@gmail.com', public_keys,private_keys);

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'client/index.html'))
})
const articles=[];
app.post('/subscribe', (req, res)=>{
    //get push subscription object from the request
    const subscription = req.body.subscription;
    // console.log(req.body);
    //send status 201 for the request
    res.status(201).json({})
    //create paylod: specified the detals of the push notification
    const payload = JSON.stringify({title: 'first Push Notification learning by me' });
    //pass the object into sendNotification fucntion and catch any error
    // SchemaModel('name', JSON.stringify(subscription));
    articles.push(subscription);
    // console.log(articles);
    run();
})
function run(){
    for(var i=0;i<articles.length;i++){
        // const data2 = JSON.parse(articles[i]);
        const payload = JSON.stringify({title: `Notificaton` });
        webpush.sendNotification(articles[i], payload).catch(err=> console.error(err));
    }
}
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

const port=process.env.PORT || 5001;
app.listen(port,()=>console.log('Server started'));