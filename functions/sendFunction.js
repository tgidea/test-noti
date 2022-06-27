const Subscribed = require('../schema/schema');
const SubscribedSecond = require('../schema/secondSchema');
const mongoose = require('mongoose');
const webpush = require('web-push');
const image = 'https://t3.ftcdn.net/jpg/03/43/43/72/360_F_343437244_HrxIVZWbfh29tgxuRlxbPXEpHMSmfkAn.jpg';

const timeOutFunction = async (result, title) => {
    try {
        console.log(result)
        for (var i = 0; i < result.length; i++) {
            console.log('Sending notification...in timeout function');
            try {
                const data2 = JSON.parse(result[i].subscripton);
                const payload = JSON.stringify({ title: `${title}`, image });
                const output = await webpush.sendNotification(data2, payload);
                if (output) {
                    console.log(output);
                }
                else {
                    console.log('Erro in sending msg');
                }
            }
            catch (err) {
                try {
                    const data2 = JSON.parse(result[i].subscription);
                    const payload = JSON.stringify({ title: `${title}`, image });
                    const output = await webpush.sendNotification(data2, payload);
                    if (output) {
                        console.log(output);
                    }
                    else {
                        console.log('Erro in sending msg');
                    }
                }
                catch (errr) {
                    console.log(errr);
                }
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}
module.exports = timeOutFunction;