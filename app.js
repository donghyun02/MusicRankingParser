var express = require('express');
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var app = express();

var ranking = {
    'melon': {},
    'bugs': {}
};

//getMelon();
getBugs();

//get ranking by melon
function getMelon() {
    request('http://www.melon.com/index.htm', (err, res, html) => {

        if(!err) {
            var $ = cheerio.load(html);
            var i = 1;

            $('.nth1 .rank_info').each(function() {
                ranking['melon'][`song${i}`] = $(this).find('.song a').text();
                ranking['melon'][`artist${i++}`] = $(this).find('.artist span a').text();
            });
        }

    //    console.log(ranking);

    });
}

//getranking by bugs
function getBugs() {
    request('http://www.bugs.co.kr/', (err, res, html) => {

        if(!err) {
            var $ = cheerio.load(html);
            var i = 1;

            console.log(html);

            $('tbody tr').each(function() {
                console.log('1');
                // ranking['bugs'][`song${i}`] = $(this).find('p.title a').text();
                // ranking['bugs'][`artist${i++}`] = $(this).find('p.artist a').text();
                console.log($(this).find('.title a').text());
            });
        }

        //console.log(ranking);

    });
}
