const express = require('express');
const path = require('path')
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

const tpc = async () =>{    
    try {
        axios('https://jcboseust.ac.in/tpo/placement-record')
            .then(res => {                
                const html = res.data;                
                const $ = cheerio.load(html);                
                const articles = [];                
                $('.field-content', html).each(function () {
                    let link = $(this).find('a').attr('href');
                    let name = $(this).find('a').text();                                                           
                    articles.push({name,link});
                });                
                fs.writeFile(path.join(__dirname, '../../../client/json/', 'TPC.json'), JSON.stringify(articles, null, 2), (err) => {
                    if (err) {
                        console.log(err , 'in tpc');
                    }                    
                })
            })
            .catch(err => console.log(err));
    }
    catch (err) { console.log(err) };        
}
tpc()
module.exports = tpc;