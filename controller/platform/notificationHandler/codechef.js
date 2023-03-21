const path = require('path');
const fs = require('fs');
const sendFunction = require('./sendNotification');
const Channel = require('../../../schema/channels');

const findDate = function (str) {
    if (str[0] == '0') {
        return parseInt(`${str[1]}`);
    }
    else {
        return parseInt(`${str[0]}${str[1]}`);
    }
}
const changeTime = function (str) {
    let newTime = "";
    let start = str[0] + str[1];

    if (str[6] == 'P') {
        start = `${parseInt(start) + 12}`;
    }
    newTime += start;
    const len = str.length - 7;
    for (var i = 2; i <= len; i++) {
        newTime += str[i];
        if (i == 4) {
            newTime += ":00";
        }
    }
    // console.log(newTime);
    return newTime;
}
const codechefNotification = async () => {
    try {

        fs.readFile(path.join(__dirname, '../../../json/codechef.json'), 'utf-8', async (err, data) => {
            if (data) {
                data = JSON.parse(data);
                let result = await Channel.findOne({ "channelName": "contest" });
                result = result.subscription.map(current => {
                    return current.endpoint;
                })
                for (var k = 0; k < data.length; k++) {
                    const first = data[k];
                    const time = first.timeOri;
                    const ist = changeTime(time.toString());                    
                    const d = new Date();
                    const preTime = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${ist}`;
                    const notifyTime = new Date(preTime);
                    // console.log(preTime, notifyTime);
                    const notifyMiliSecond = notifyTime.getTime();

                    let finalResult = notifyMiliSecond - Date.now();
                    // console.log(findDate(data[k].day.toString()), finalResult);

                    //As render server in US so new Date convert according to US zone;
                    finalResult = finalResult - 19825208;

                    // console.log('FInal is ', finalResult);
                    if (findDate(data[k].day.toString()) == d.getDate() && ((finalResult >= (-60000) && finalResult <= 910000) || (finalResult>=1800000 && finalResult<=2410000) )) {
                        sendFunction(result,(`contest : ${data[k].name}`));
                    }
                }
            }
        })
    }
    catch (err) {
        console.log(err);
    }

}
// codechefNotification();
module.exports = codechefNotification;