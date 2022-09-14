const express = require('express');
const path = require('path')
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { data } = require('cheerio/lib/api/attributes');


var dataStore4 = [];
var _time = Date.now();

const atcoderApi = function (request,response) {
    try {
        if(Date.now()-_time<1800000 && dataStore4.length>0){            
            _time = Date.now();            
            response.send({"data":dataStore4,"error":"false"});
            // console.log('not fetch atcoder');
            return;            
        }
        else{
            _time = Date.now();
        }
        axios('https://atcoder.jp/')
            .then(res => {
                const html = res.data;
                const $ = cheerio.load(html);
                const articles = [];
                let name, time, timeLink, nameLink;
                $('#contest-table-active', html).each(function () {
                    let j = 0;
                    $(this).find('td').each(function () {                    
                        const a = $(this).find('a');                        
                        if (j == 0) {
                            timeLink = a.attr('href');
                            time = a.text();
                        }
                        if (j == 1) {
                            name = a.text();
                            nameLink = 'https://atcoder.jp'+a.attr('href');
                        }
                        j++;
                    })
                    if (name != undefined) {
                        articles.push({ name, nameLink, time, timeLink });
                    }
                })
                $('#contest-table-upcoming', html).each(function () {
                    $(this).find('tbody').find('tr').each(function () {
                        let i = 0;
                        $(this).find('td').each(function () {
                            var b = $(this).find('a');
                            if (i == 0) {
                                timeLink = b.attr('href');                                
                                time = b.text();
                            }
                            if (i == 1) {
                                name = b.text();
                                nameLink ='https://atcoder.jp'+b.attr('href');
                            }
                            i++;
                        })
                        if (name != undefined) {                            
                            articles.push({ name, nameLink, time, timeLink});
                        }
                    })
                })

                if (articles.length > 0) { 
                    dataStore4 = articles;                   
                    response.send({"data":articles,"error":"false"});
                    return;
                }
            })
            .catch(err => console.log(err));
    }
    catch (err) {
         console.log('atcoder err3') 
         response.send({"data":"","error":true});
    } 
}
module.exports = atcoderApi;