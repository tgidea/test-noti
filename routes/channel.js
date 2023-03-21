const router = require('express').Router();
const addendpoint = require('../controller/addEndpoint');
const deleteEndpoint = require('../controller/deleteEndpoint');
const Creator = require('../schema/creatorInfo');
const Channel = require('../schema/channels');


router.post('/subscribe', (req, res) => {
    
    const endpoint = req.body.subscription;    
    const channel = req.body.channel.toString().toLowerCase().trim();         
    if (channel.length > 2) {
        addendpoint(channel,endpoint,req,res);        
    }
    else {
        res.status(400).json({ "result": "Please fill carefully" });
    }
})

router.post('/unsubscribe', async (req, res) => {
    const channel = req.body.channel.toString().toLowerCase().trim();
    const endpoint = req.body.subscription;  
    if (channel.length > 2) {
        try {
            deleteEndpoint(channel,endpoint,req,res);
        }
        catch (err) {
            console.log(err);
            res.send({ "result": "Please Subscribe first" });
        }
    }
})

router.post('/create', async (req, res) => {
    try {
        const channel = req.body.channel.toString().toLowerCase().trim();
        const password = req.body.password.toString();
        const document = new Creator({
            channel,
            password
        })
        await document.save();
        
        const newChannel = new Channel({
            channelName : channel ,
            subscription : []
        })
        await newChannel.save();

        res.status(200).send({ "result": "okk" });
    }
    catch (err) {
        console.log("This name is already taken");
        res.status(400).send({ "result": 'This name is already taken' });
    }
})

module.exports = router;