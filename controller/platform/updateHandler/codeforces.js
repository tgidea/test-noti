const path = require('path')
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const updateSheet = require('./updateSheet')
const rasta = path.join(__dirname, '../', 'config.env');
require('dotenv').config({ path: rasta });
const excel = process.env.EXCEL;
let lastUpdated = excel+1;

const changeTime = function (str) {
    var num = "", num2 = "", carry = 0, actual = "", i;
    const len = str.length;
    for (i = len - 1; i > len - 5; i--) {
        if (str[i] == ':') {
            for (var j = i - 1; j >= i - 2; j--) {num2 += str[j];}
            break;
        }
        else {num += str[i];}
    }
    var minute = parseInt(num.split('').reverse().join(''));
    var hour = parseInt(num2.split('').reverse().join(''));
    minute += 30;
    if (minute > 60) {
        minute = minute - 60;
        hour += 3;
    }
    else {hour += 2;}
    for (var j = 0; j < i - 2; j++) {actual += str[j];}
    actual += " " + hour + ":" + minute;
    return actual;
}

const codeforcesupd = function () {

    try {
        axios('https://codeforces.com/contests')
            .then(res => {
                const html = res.data;
                const $ = cheerio.load(html);                
                let i = 0;
                const articles = [];
                let name, time, duration, toStart, toRegister, link , timeOri;
                $('table', html).each(function () {
                    if (i == 0) {
                        $(this).find('tr').each(function () {

                            let j = 0;
                            $(this).find('td').each(function () {

                                const dataInner = $(this).text();
                                if (j == 0) {
                                    name = dataInner;
                                    link = `https://codeforces.com/contests`;
                                }
                                if (j == 2) {                                    
                                    timeOri = dataInner.trim();
                                    time = changeTime(timeOri)
                                }
                                if (j == 3) {
                                    duration = dataInner.trim();
                                }
                                if (j == 4) {
                                    toStart = dataInner.trim();
                                }
                                if (j == 5) {
                                    toRegister = dataInner.trim();
                                }
                                j++;
                            })
                            if (name != undefined) {
                                var codePrevUpd = Date.now();
                                articles.push({ name, time, duration, timeOri, toStart, toRegister, link ,codePrevUpd});
                            }
                        })                        
                    }
                    else {
                        return;
                    }
                    i++;
                })
                if (articles.length > 0) {
                    fs.writeFile(path.join(__dirname, '../../../client/json/', 'CODEFORCES.json'), JSON.stringify(articles, null, 2), (err) => {
                        if (err) {
                            console.log('codeforces err 1');
                        }
                    })
                    if(Date.now()-lastUpdated>parseInt(excel)){
                        setTimeout(function(){
                            updateSheet(articles,"codeforces");
                        },15000);                                                                                  
                        lastUpdated = Date.now();                        
                    }                    
                }
            })
            .catch(err => console.log(err));
    }
    catch (err) { console.log('codeforces err3') }
}
// codeforcesupd();
module.exports = codeforcesupd;