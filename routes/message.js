const router = require('express').Router();

router.post('/formsubmit',async(req,res)=>{
    try{        
        if(req.body.name.length < 2 || req.body.email == "" || req.body.comment==""){
            res.status(400).send({"result":"Please fill carefully"});
            return;
        }
        res.send({"result":"Your response has been recorded."});
    }
    catch(err){
        console.log(err);
        res.status(400).send({"result":"Some error occured."});
    }
})

module.exports = router;