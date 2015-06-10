/**
 * Created by xiaoleiyu on 15-6-10.
 */
var fs = require('fs'),
    request = require("request"),
    cheerio = require("cheerio"),
    _ = require('underscore'),
    eventproxy = require('eventproxy'),
    json2csv = require('json2csv'),
    amzHomepage = 'http://www.amazon.ca',
    urlTemplate = 'http://www.amazon.ca/gp/search/other?me=A3AGDX6JQ8S30S&rh=i%3Amerchant-items&pickerToList=brandtextbin&indexField=@&ie=UTF8';

var allBrands = [];
var totalNumProducts = totalBrands = 0;
var brandsURLPieces = ['%23', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var ep = new eventproxy();
ep.after('brands', brandsURLPieces.length, function (dummy) {
    _.each(allBrands, function (brand, idx) {
        console.info(brand.name + '\t\t' + brand.numProducts + '\t\t' + brand.link);
    });

    var fields = ['name', 'numProducts', 'link'];
    json2csv({data: allBrands, fields: fields}, function (err, csv) {
        if (err) console.log(err);

        fs.writeFile('./brands.csv', csv, function (err) {
            if (err) throw err;

            console.info('the csv is written.');
        });
    });

    console.info('total number of brands: ' + totalBrands + ', total number of products: ' + totalNumProducts);
});

_.each(brandsURLPieces, function (brandCategory, idx) {
    var brandCategoryURL = urlTemplate.replace('@', brandCategory);

    // request all the brands
    request(brandCategoryURL, function (err, response, body) {
        if (err) console.log("We’ve encountered an error: " + error);

        console.info('scraped category: ' + brandCategoryURL);
        var $ = cheerio.load(body);
        var elemBrands = $('ul.column').find('li').find('a');
        var brands = [];

        _.each(elemBrands, function (elemBrandSelector, idx) {
            var elemBrand = $(elemBrandSelector);
            var elemNumProducts = elemBrand.find('span.narrowValue').text();
            if (!elemNumProducts) elemNumProducts = '0';
            var numProducts = parseInt(elemNumProducts.match(/[0-9]+/)[0]);

            allBrands.push({
                name: elemBrand.find('span.refinementLink').text().trim(),
                link: amzHomepage + elemBrand.attr('href'),
                numProducts: numProducts
            });
            totalBrands++;
            totalNumProducts += numProducts;
        });

        ep.emit('brands', null);
    });
});