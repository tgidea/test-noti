const express = require('express');
const path = require('path')
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { data } = require('cheerio/lib/api/attributes');

var dataStore2 = [];
var _time = Date.now();

const codechefApi = function (request,response) {
    try {
        if(Date.now()-_time<1800000 && dataStore2.length>0){            
            _time = Date.now();            
            response.send({"data":dataStore2,"error":"false"});
            // console.log('not fetch codechef');
            return;
        }
        else{
            _time = Date.now();
        }
        console.log('heree');
        axios('https://www.codechef.com/')
            .then(res => {
                const html = res.data;
                const $ = cheerio.load(html);
                const articles = [];
                let day, month, name, time, link;
                $('.m-next-event-card', html).each(function () {
                    $(this).find('.m-card-3__day').each(function () {
                        day = $(this).text()
                    })
                    $(this).find('.m-card-3__month').each(function () {
                        month = $(this).text();
                    })
                    $(this).find('.m-card-3__head').each(function () {
                        name = $(this).text();
                    })
                    $(this).find('.m-card-3__time-clock').each(function () {
                        time = $(this).text().trim();
                    })
                    $(this).find('.m-card-3__dtl-btn').each(function () {
                        link = $(this).attr('href');
                    })
                    if (day != undefined && name != undefined) {
                        articles.push({ day, month, name, time, link });
                    }
                    // console.log(articles);
                })
                $('.m-other-event-card', html).each(function () {
                    $(this).find('.m-card-3__day').each(function () {
                        day = $(this).text()
                        // console.log($(this).text());
                    })
                    $(this).find('.m-card-3__month').each(function () {
                        month = $(this).text();
                    })
                    $(this).find('.m-card-3__head').each(function () {
                        name = $(this).text();
                    })
                    $(this).find('.m-card-3__time-clock').each(function () {
                        time = $(this).text().trim();
                    })
                    $(this).find('.m-card-3__dtl-btn').each(function () {
                        link = $(this).attr('href');
                    })
                    if (day != undefined && name != undefined) {                        
                        articles.push({ day, month, name, time, link });
                    }
                    // console.log(articles);
                })
                if (articles.length > 0) { 
                    dataStore2 = articles;                   
                    response.send({"data":articles,"error":"false"});
                    return;
                }
            })
            .catch(err => console.log(err));
    }
    catch (err) {
         console.log('codechef err3') 
         response.send({"data":"","error":true});
    } 
}
module.exports = codechefApi;