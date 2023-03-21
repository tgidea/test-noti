const express = require('express');
const path = require('path')
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { data } = require('cheerio/lib/api/attributes');
const updateSheet = require('./updateSheet')
const rasta = path.join(__dirname, '../', 'config.env');
require('dotenv').config({ path: rasta });
const excel = process.env.EXCEL;
let lastUpdated = excel+1;

const changeTime = function (str) {
    var aray = str.split(" ");
    if(aray.length<2)return str;    
    var time = ""+aray[1];
    time = time.split(':');
    var hrs = parseInt(time[0]);
    var min = parseInt(time[1]);
    if(min>=30){
        min = "00";
        hrs += 1;
    }
    else{min += 30;}
    hrs += 5;
    if(hrs>=12){
        hrs = hrs-12;
        if(aray[2]=="PM"){
            aray[2]="AM";
            var dayIdx = {
                "sunday" : 0,
                "monday" : 1,
                "tuesday" : 2,
                "wednesday" : 3,
                "thursday" : 4,
                "Friday" : 5,
                "saturday" : 6
            }
            var day = ['Sunday', 'Monday' ,'Tuesday','Wednesday','Thursday','Friday', 'Saturday' ];
            aray[0] = day[ (dayIdx[(""+aray[0]).toLowerCase()]+1)%7 ];            
        }
        else aray[2]="PM";
    }
    return "" + aray[0] + " " + hrs + ":" + min + " " + aray[2] +" IST";  
}

const leetcodeUpd = function () {
    try {
        axios('https://leetcode.com/contest/')
            .then(res => {
                const html = res.data;
                const $ = cheerio.load(html);                
                const articles = [];
                var i  = 0;                
                let name, time ,link , timeOri;
                $('.swiper-slide', html).each(function () {                       
                    let url , link , name , numb ;                                                                                           
                    url = ($(this).find('a').attr('href'));                  
                    link = "https://leetcode.com" + url;                                                        
                    name = url.split("/")[2];                    
                    timeOri = ($(this).text());                     
                    numb = name.toString().split("-")[2];
                    time = timeOri.split(`${numb}`)[1].toString();
                    if(time.indexOf('Ended')==-1){
                        time = changeTime(time);                                                                    
                        articles.push({ link, name , time , timeOri});
                    }                                        
                    i++;                    
                })
                if (articles.length > 0) {                    
                    fs.writeFile(path.join(__dirname, '../../../client/json/', 'LEETCODE.json'), JSON.stringify(articles, null, 2), (err) => {
                        if (err) {console.log(err);}
                    })                                  
                    if(Date.now()-lastUpdated>parseInt(excel)){                                                                    
                        updateSheet(articles,"leetcode");
                        lastUpdated = Date.now();                        
                    }    
                }
            })
            .catch(err => console.log(err));
    }
    catch (err) { console.log(err) }
}
module.exports = leetcodeUpd;