const path = require('path');
const fs = require('fs');
const Subscribed = require('../schema/schema');
const mongoose = require('mongoose');
const webpush = require('web-push');
const timeOutFunction = require('../functions/sendFunction');


const findDate = function (str) {
    if (str[4] == '0') {
        return parseInt(`${str[5]}`);
    }
    else {
        if (str[4] == '/') {
            return parseInt(`${str[5]}${str[6]}`);
        }
        return parseInt(`${str[4]}${str[5]}`);
    }
}
const changeTime = function (str) {
    var num = "", num2 = "", carry = 0, actual = "", i;
    const len = str.length;
    for (i = len - 1; i > len - 5; i--) {
        if (str[i] == ':') {
            for (var j = i - 1; j >= i - 2; j--) {
                num2 += str[j];
            }
            break;
        }
        else {
            num += str[i];
        }
    }
    var minute = parseInt(num.split('').reverse().join(''));
    var hour = parseInt(num2.split('').reverse().join(''));
    minute += 30;
    if (minute >= 60) {
        minute = minute - 60;
        hour += 3;
    }
    else {
        hour += 2;
    }
    for (var j = 0; j < i - 2; j++) {
        actual += str[j];
    }
    minute = minute.toString();
    if (minute.length == 1) {
        minute = `0${minute}`;
    }
    actual = hour + ":" + minute + ":00";
    return actual;
}
const codeforcesNotification = async () => {
    try {
        fs.readFile(path.join(__dirname, '../json/codeforces.json'), 'utf-8', async (err, data) => {
            if (data) {
                data = JSON.parse(data);
                const result = await Subscribed.find();
                for (var k = 0; k < data.length; k++) {
                    // if (data.length > 0) {
                    const first = data[k];
                    const time = first.time;
                    const ist = changeTime(time.toString());
                    const d = new Date();
                    const preTime = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${ist}`;
                    // console.log(preTime);
                    const notifyTime = new Date(preTime);
                    const notifyMiliSecond = notifyTime.getTime();
                    let finalResult = notifyMiliSecond - Date.now();
                    //As heroku server in US so new Date convert according to US zone;



                    finalResult = finalResult - 19825208;



                    if (findDate(time.toString()) == d.getDate() && ((finalResult >= (-60000) && finalResult <= 910000) || (finalResult>=1800000 && finalResult<=2410000) )) {
                        console.log(finalResult, findDate(time.toString()));
                        timeOutFunction(result, data[k].name);
                    }
                }
                
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}
module.exports = codeforcesNotification;