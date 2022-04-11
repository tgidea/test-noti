const Subscribed = require('../schema');
const mongoose = require('mongoose');
const webpush = require('web-push');

const timeOutFunction = async(result, title) => {
        try {
            for (var i = 0; i < result.length; i++) {
                console.log('Sending notification...in timeout function');
                try {
                    const data2 = JSON.parse(result[i].subscripton);
                    const payload = JSON.stringify({ title: `${title}` });
                    const output = await webpush.sendNotification(data2, payload);
                    if (output) {
                        console.log(output);
                    }
                    else {
                        console.log('Erro in sending msg');
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        catch (err) {
            console.log(err);
        }
}
module.exports=timeOutFunction;