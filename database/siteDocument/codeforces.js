const SubscriptionName = require('../Schema/codeforce');
const codeforcesModel = async (client, subscripton)=>{
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
module.exports=codeforcesModel;