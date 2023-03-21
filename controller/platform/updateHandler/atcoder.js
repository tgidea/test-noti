const express = require('express');
const path = require('path')
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const updateSheet = require('./updateSheet')
const rasta = path.join(__dirname, '.././', 'config.env');
require('dotenv').config({ path: rasta });
const excel = process.env.EXCEL;
console.log(excel)

let lastUpdated = excel+1;
const changeTime = function (str) {
    var num1 = "", num2 = "", date = "", carry = 0, actual = "", i, j;
    const len = str.length;
    for (i = 0; i < 8; i++) {actual += str[i];}    
    for (d = i; d < 11; d++) {date += str[d];}
    for (j = d; j < d + 2; j++) {num1 += str[j];}
    for (k = j + 1; k < j + 3; k++) {num2 += str[k];}
    var hour = parseInt(num1);
    var minute = parseInt(num2);
    if (hour >= 0 && hour <= 3 && minute<30) {date = date - 1;}    
    minute = minute - 30;    
    if (minute < 0) {
        carry = 1;
        minute = Math.abs(minute)
    }    
    if (carry == 1) {hour = 20 + hour;}
    else {hour = 21 + hour;}
    if (hour >= 24) {hour = hour - 24;}    
    if (hour != NaN && minute != NaN && hour != undefined && minute != undefined) {actual += date + " " + hour + ":" + minute ;}       
    return actual;
}
const atcoderupd = function () {
    try {
        axios('https://atcoder.jp/')
            .then(res => {
                const html = res.data;
                const $ = cheerio.load(html);
                const articles = [];
                let name, time , timeOri, timeLink, link;
                $('#contest-table-active', html).each(function () {
                    let j = 0;
                    $(this).find('td').each(function () {                    
                        const a = $(this).find('a');                        
                        if (j == 0) {
                            timeLink = a.attr('href');                                
                            timeOri = a.text();
                            time = changeTime(timeOri);
                        }
                        if (j == 1) {
                            name = a.text();
                            link = 'https://atcoder.jp'+a.attr('href');
                        }
                        j++;
                    })
                    if (name != undefined) {
                        articles.push({ name, link,timeOri, time, timeLink });
                    }
                })
                $('#contest-table-upcoming', html).each(function () {
                    $(this).find('tbody').find('tr').each(function () {
                        let i = 0;
                        $(this).find('td').each(function () {
                            var b = $(this).find('a');
                            if (i == 0) {
                                timeLink = b.attr('href');                                
                                timeOri = b.text();
                                time = changeTime(timeOri);
                            }
                            if (i == 1) {
                                name = b.text();
                                link ='https://atcoder.jp'+b.attr('href');
                            }
                            i++;
                        })
                        if (name != undefined) {
                            var codePrevUpd = Date.now();
                            articles.push({ name, link,timeOri, time, timeLink ,codePrevUpd});
                        }
                    })
                })
                fs.writeFile(path.join(__dirname, '../../../json/', 'atcoder.json'), JSON.stringify(articles, null, 2), (err) => {
                    if (err) {
                        console.log('atcoder error1',err);
                    }
                }) 
                if(Date.now()-lastUpdated>parseInt(excel)){   
                    setTimeout(function(){
                        updateSheet(articles,"atcoder");
                    },10000);                                                                               
                    lastUpdated = Date.now();                        
                }                    
            })
            .catch(err => console.log(err));
    }
    catch (err) { console.log('atcoder error') }
}
// atcoderupd();
module.exports = atcoderupd;