var express = require('express');
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var app = express();
var melon = {},
    bugs = {},
    mnet = {},
    genie = {};

app.listen(8000, () => {
    console.log('Server on http://127.0.0.1:8000');
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {

    fs.readFile('src/index.html', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });

});

app.post('/melon', (req, res) => {
    getMelon();
    res.send({'melon': melon});
});

app.post('/bugs', (req, res) => {
    getBugs();
    res.send({'bugs': bugs});
});

app.post('/genie', (req, res) => {
    getGenie();
    res.send({'genie': genie});
});

app.post('/mnet', (req, res) => {
    getMnet();
    res.send({'mnet': mnet});
});

//get ranking by melon
function getMelon() {
    request('http://www.melon.com/index.htm', (err, res, html) => {

        if(!err) {
            var $ = cheerio.load(html);
            var i = 1;

            $('.nth1 .rank_info').each(function() {
                melon[`song${i}`] = $(this).find('.song a').text();
                melon[`artist${i++}`] = $(this).find('.artist span a').text();
            });
        }

    });
}

//get ranking by bugs
function getBugs() {
    request('http://music.bugs.co.kr/chart?wl_ref=M_left_02_01', (err, res, html) => {

        if(!err) {
            var $ = cheerio.load(html);
            var i = 1;

            $('#CHARTrealtime .list th .title').each(function(index) {
                bugs[`song${i++}`] = $(this).find('a').text();

                return index < 9;
            });

            i = 1;

            $('#CHARTrealtime .list td .artist').each(function(index) {
                bugs[`artist${i++}`] = $(this).find('a').text();

                return index < 9;
            });

        }

    });
}

//get ranking by genie
function getGenie() {
    request('http://www.genie.co.kr/chart/top100', (err, res, html) => {

        if(!err) {
            var $ = cheerio.load(html);
            var i = 1;

            $('.newest-list .music-list-wrap .list-wrap .list').each(function(index) {

                if(!(index % 2)) {
                    genie[`song${i}`] = $(this).find('.music-info .music_area .music a.title').text();
                    genie[`artist${i++}`] = $(this).find('.music-info .music_area .music a.artist').text();
                }

                return index < 18;
            });

        }

    });

}

//get ranking by mnet
function getMnet() {

    request('http://www.mnet.com/chart/top100', (err, res, html) => {

        if(!err) {
            var $ = cheerio.load(html);
            var i = 1;

            $('.MnetMusicList table tbody tr').each(function(index) {
                mnet[`song${i}`] = $(this).find('.MMLI_Song').text();
                mnet[`artist${i++}`] = $(this).find('.MMLIInfo_Artist').text();

                return index < 9;
            })
        }

    });

}
