const express = require('express');
const path = require('path')
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { data } = require('cheerio/lib/api/attributes');

const leetcodeUpd = function () {

    try {
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
                        // console.log(time);
                        articles.push({ link, name , time});
                    }
                    i++;                    
                })
                if (articles.length > 0) {                    
                    fs.writeFile(path.join(__dirname, '../client/leetcode', 'leetcode.json'), JSON.stringify(articles, null, 2), (err) => {
                        if (err) {
                            console.log('leetcode error1',err);
                        }
                    })
                    fs.writeFile(path.join(__dirname, '../json/', 'leetcode.json'), JSON.stringify(articles, null, 2), (err) => {
                        if (err) {
                            console.log('leetcode err 2');
                        }
                    })
                }
            })
            .catch(err => console.log(err));
    }
    catch (err) { console.log('leetcode err3') }
}
module.exports = leetcodeUpd;