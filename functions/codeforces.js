const path = require('path');
const fs = require('fs');
const Subscribed = require('../schema');
const mongoose = require('mongoose');
const webpush = require('web-push');
const timeOutFunction=require('../functions/sendFunction');



const findDate = function (str) {
    if (str[4] == '0') {
        return parseInt(`${str[5]}`);
    }
    else {
        if (str[4] == 'e' || str[4] == 'y') {
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
                fileResult = data;
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
                    // console.log(finalResult);
                    if (finalResult == NaN) {
                        finalResult = 2000000;
                    }
                    if (findDate(time.toString()) == d.getDate() && finalResult >= (-300000) && finalResult <= 1810000) {
                        console.log('here in codforces');
                        const result = await Subscribed.find();
                        finalResult = finalResult - 600000;
                        if (finalResult < 0) { finalResult = 2000 };
                        console.log('in ...', finalResult);
                        const timeOutFunction = (result, title) => {
                            setTimeout(async () => {
                                try {
                                    for (var i = 0; i < result.length; i++) {
                                        const data2 = JSON.parse(result[i].subscripton);
                                        const payload = JSON.stringify({ title: `${title}` });
                                        try {
                                            const output = await webpush.sendNotification(data2, payload);
                                            if (output) {
                                                console.log(output);
                                            }
                                            else {
                                                console.log('Erro in sending msg');
                                            }
                                        }
                                        catch (err) {
                                            console.log(`error in sending ${i}`);
                                        }
                                    }
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            }, finalResult);
                        }
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
codeforcesNotification();
module.exports = codeforcesNotification;