const path = require('path');
const fs = require('fs');
const Subscribed = require('../schema/schema');
const mongoose = require('mongoose');
const webpush = require('web-push');
const timeOutFunction = require('./sendFunction');

const atcoderNotification = async () => {
    try {
        fs.readFile(path.join(__dirname, '../json/atcoder.json'), 'utf-8', async (err, data) => {
            if (data) {
                data = JSON.parse(data);
                // console.log(data);
                const result = await Subscribed.find();
                // for (var k = 0; k < data.length; k++) {
                    
                    //As heroku server in US so new Date convert according to US zone;
                         
                    // finalResult = finalResult - 19825208;

                //     console.log('FInal is ', finalResult);
                //     if (findDate(data[k].day.toString()) == d.getDate() && ((finalResult >= (-60000) && finalResult <= 910000) || (finalResult>=1800000 && finalResult<=2410000) )) {
                //         console.log('here in atcoder');
                //         console.log('calling timeout fucniton');
                //         timeOutFunction(result, data[k].name);
                //     }
                // }
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}
atcoderNotification();
module.exports = atcoderNotification;