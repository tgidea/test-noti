const path = require('path');
const fs = require('fs');
const Subscribed = require('../schema');
const mongoose = require('mongoose');
const webpush = require('web-push');
const findDate = function (str) {
    if (str[0] == '0') {
        return parseInt(`${str[1]}`);
    }
    else {
        return parseInt(`${str[0]}${str[1]}`);
    }
}
const changeTime = function (str) {
    let newTime="";
    let start=str[0]+str[1];
    
    if(str[6]=='P'){
        start=`${parseInt(start)+12}`;
    }
    newTime+=start;
    const len = str.length-7;
    for (var i=2;i<=len;i++) {
        newTime+=str[i];
        if(i==4){
            newTime+=":00";
        }
    }    
    console.log(newTime);
    return newTime;
}
const codechefNotification = async () => {
    try {
        let fileResult;
        fs.readFile(path.join(__dirname, '../json/codechef.json'), 'utf-8', async (err, data) => {
            if (data) {
                data = JSON.parse(data);
                for (var k = 0; k < data.length; k++) {                    
                    const first = data[k];
                    const time = first.time;
                    const ist = changeTime(time.toString());
                    const d = new Date();
                    const preTime = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${ist}`;
                    const notifyTime = new Date(preTime);
                                
                    const notifyMiliSecond = notifyTime.getTime();
                    console.log(notifyMiliSecond,'codechef');
                    let finalResult=notifyMiliSecond-Date.now();
                    console.log('finalresult',finalResult)
                    if (findDate(data[k].day.toString()) == d.getDate()  && finalResult>=(-300000) && finalResult<=1810000) { 
                        console.log('here in codchef');
                        const result = await Subscribed.find();
                        finalResult=finalResult-600000;
                        if(finalResult<0){finalResult=2000};
                        console.log('in  codechef: ',finalResult);
                        const timeOutFunction = (result,title) => {
                            setTimeout(async () => {
                                try {
                                    for (var i = 0; i < result.length; i++) {
                                        const data2 = JSON.parse(result[i].subscripton);
                                        const payload = JSON.stringify({ title: `${title}` });
                                        webpush.sendNotification(data2, payload).catch(err => console.error('error in sending at codchef'));
                                    }
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            }, finalResult);
                        }
                        timeOutFunction(result,data[k].name);
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