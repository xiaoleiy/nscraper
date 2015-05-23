/**
 * Created by xiaoleiyu on 15-5-23.
 */
var fs      = require('fs'),
    request = require("request"),
    cheerio = require("cheerio"),
    _       = require('underscore'),
    json2csv = require('json2csv'),
    url     = "https://www.allbud.com/marijuana-strains/search?page=2";

request(url, function (err, response, body) {
    if (err)
        console.log("We’ve encountered an error: " + error);

    var $ = cheerio.load(body),
        strainELements = $("#search-results").find("div[data-label='strain']"),
        strains = [];

    _.each(strainELements, function (strain, idx) {
        var header = $(strain).find('.header');
        var footer = $(strain).find('.footer');

        var title = $('.title-box a', header).text().trim();
        var totalVotes = $('.votes', header).find('span[id^="object-rating-votes"]').text().trim();
        var headerImg = $('.header-image', header).attr('src');
        var rating = $('.rating', footer).text().trim();
        var desc = $('.rateable-text', footer).text().trim();
        var link = $('.view', footer).attr('href');
        console.info('============================');
        console.info('title: ' + title + ', totalVotes:' + totalVotes + ', stars: ' + 0 + ', image: ' + headerImg);
        console.info('rating: ' + rating + ', desc: ' + desc + ', link: ' + link);

        strains.push({
            title: title,
            votes: totalVotes,
            rating: rating,
            desc: desc,
            thumb: headerImg,
            link: link
        });
    });

    //var fields = ['title', 'votes', 'rating', 'desc', 'thumb', 'link'];
    json2csv({data: strains/*, fields: fields*/}, function (err, csv) {
        if (err) console.log(err);

        fs.writeFile('./strains.csv', csv, function (err) {
            if (err) throw err;
            console.info('the csv is saved.');
        });
        //console.log(csv);
    });


});