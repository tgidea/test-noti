const SubscriptionName = require('./schema');
const mongoose = require('mongoose');
const codechefModel = async (client, subscripton)=>{
    try {
        const info = new SubscriptionName({
            "client": `${client}`,
            "subscripton": (subscripton)
        })
        await info.save();
    }
    catch (err) {
        console.log(err);
    }
}
module.exports=codechefModel;