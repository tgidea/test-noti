const express = require('express');
const path = require('path')
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

const codechefupd = function () {
    try {
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
                        var codePrevUpd = Date.now();
                        articles.push({ day, month, name, time, link , codePrevUpd});
                    }
                    // console.log(articles);
                })
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
                }
            })
            .catch(err => console.log(err));
    }
    catch (err) { console.log('codechef err3') }
}
codechefupd();
module.exports = codechefupd;