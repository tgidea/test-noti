const SubscriptionName = require('../Schema/leetcode');
const leetcodeModel = async (client, subscripton)=>{
    const mongoose = require('mongoose');
    try {
        const info = new SubscriptionName({
            "client": "Test",
            "subscripton": (subscripton)
        })
        await info.save();
    }
    catch (err) {
        console.log(err);
    }
}
module.exports=leetcodeModel;