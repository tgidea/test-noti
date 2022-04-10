const SubscriptionName = require('../Schema/codechef');
const mongoose = require('mongoose');
const codechefModel = async (client, subscripton)=>{
    console.log('in codecheff model');
    try {
        const info = new SubscriptionName({
            "client": "Test",
            "subscripton": (subscripton)
        })
        const result=await info.save();
    }
    catch (err) {
        console.log(err);
    }
}
module.exports=codechefModel;