const express = require('express');
const path = require('path')
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const updateSheet = require('./updateSheet')
const rasta = path.join(__dirname, '../', 'config.env');
require('dotenv').config({ path: rasta });
const excel = process.env.EXCEL;
let lastUpdated = excel+1;

const codechefupd = function () {
    try {
        axios('https://codechef.com')
            .then(res => {
                const html = res.data;
                const $ = cheerio.load(html);                
                const articles = [];
                let day, month, name, time, link ,timeOri;
                $('.listContent', html).each(function (index) {
                    if(index==3){
                        $(this).find('.listItemHeader').each(function () {
                          name = $(this).text().trim();
                        })
                        $(this).find('.listItemBody').each(function () {
                            $(this).find('.listTextContainer').each(function (ind) {
                                const res = $(this).text().trim();
                              if(ind==0){
                                day = res.split(" ")[2];
                                month = res.split(" ")[3];
                              }
                              if(ind==1){
                                time = timeOri = res;
                              }
                            })                          
                        })
                        link =  "https://www.codechef.com/contests";                        
                    }                                       
                })
                if (day != undefined && name != undefined) {                        
                    articles.push({ day, month, name, time, link ,timeOri});
                }                

                if (articles.length > 0) {
                    fs.writeFile(path.join(__dirname, '../client/codechef', 'codechef.json'), JSON.stringify(articles, null, 2), (err) => {
                        if (err) {
                            console.log('atcoder error1',err);
                        }
                    })
                    fs.writeFile(path.join(__dirname, '../json/', 'codechef.json'), JSON.stringify(articles, null, 2), (err) => {
                        if (err) {
                            console.log('codechef error1');
                        }
                    })
                    if(Date.now()-lastUpdated>parseInt(excel)){
                        setTimeout(function(){
                            updateSheet(articles,"codechef");
                        },5000);                                                                    
                        lastUpdated = Date.now();                        
                    }                    
                }
                
            })
            .catch(err => console.log(err));
    }
    catch (err) { console.log('codechef err3') }
}
// codechefupd();
module.exports = codechefupd;