const express = require('express');
const path = require('path')
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { data } = require('cheerio/lib/api/attributes');


var dataStore = [];
var _time = Date.now();

const leetApi = function (request,response) {
    try {
        if(Date.now()-_time<1800000 && dataStore.length>0){                                    
            response.send({"data":dataStore,"error":"false"}); 
            // console.log('not fetch leetcode');
            return;    
        }
        else{
            _time = Date.now();
        }        
        axios('https://leetcode.com/contest/')
            .then(res => {
                const html = res.data;
                const $ = cheerio.load(html);                
                const articles = [];
                var i  = 0;
                let name, time , link;
                $('.jsx-3209139589', html).each(function () {
                                        
                    // console.log(i);
                    if(i%9==0){                       
                        link = "https://leetcode.com" + ($(this).find('a').attr('href'));
                        // console.log(link);
                    }                    
                    if(i%9==6){
                        name = ($(this).text());
                        // console.log(name);                        
                    }                                        
                    if(i%9==8){
                        time = ($(this).text());                        
                        articles.push({ link, name , time});
                    }
                    i++;                    
                })
                if (articles.length > 0) { 
                    dataStore = articles;                   
                    response.send({"data":articles,"error":"false"});
                    return;
                }
            })
            .catch(err => console.log(err));
    }
    catch (err) {
         console.log('leetcode err3') 
         response.send({"data":"","error":true});
    } 
}
module.exports = leetApi;