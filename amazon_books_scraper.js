/**
 * Created by xiaoleiyu on 15-5-23.
 */
var fs          = require('fs'),
    request     = require("request"),
    cheerio     = require("cheerio"),
    _           = require('underscore'),
    _str        = require('underscore.string'),
    json2csv    = require('json2csv'),
    url         = "http://www.amazon.ca/s/ref=dp_byline_sr_book_1?ie=UTF8&field-author=Joseph+A+Maciariello&search-alias=books-ca",
    bookDetailItems = ['Publisher', 'Language', 'ISBN-10', 'ISBN-13', 'Amazon Bestsellers Rank'],
    books       = [];

// init the csv file with headers.
var fields = ['productURL', 'title', 'authorName', 'authorUrl', 'Publisher', 'Language', 'ISBN-10', 'ISBN-13', 'Amazon Bestsellers Rank', 'price', 'quantity', 'shippingCost'];
json2csv({data: books, fields: fields}, function (err, csv) {
    if (err) console.log(err);

    fs.writeFile('./books.csv', csv, function (err) {
        if (err) throw err;
        console.info('the csv is initilized.');
        fs.appendFileSync('./books.csv', '\n');
    });
});

// request all the books and append book entry into the csv file
request(url, function (err, response, body) {
    if (err)
        console.log("We’ve encountered an error: " + error);

    var $ = cheerio.load(body),
        bookLinks = $('li.s-result-item').find('a.s-access-detail-page');

    _.each(bookLinks, function (bookLink, idx) {
        var href = $(bookLink).attr('href');
        request(href, function (err, response, body) {
            if (err)
                console.log("We’ve encountered an error: " + error);

            var $ = cheerio.load(body),
                bookTitle = $('div#booksTitle'),
                bookDetails = $('div#detail_bullets_id').find('div.content').find('li'),
                buyDetails = $('div#buybox'),
                book = {};

            book.productURL = href;
            book.title = bookTitle.find('span#productTitle').text().trim();
            var author = bookTitle.find('span.author').find('a');
            book.authorName = author.text().trim();
            book.authorUrl = 'http://www.amazon.ca' + author.attr('href');

            _.each(bookDetails, function (item, idx) {
                var name = $(item).find('b').text().replace(':', '');
                if (!_.contains(bookDetailItems, name)) {
                    return;
                }

                var val = _str.trim($(item).contents().filter(function () {
                    return this.nodeType === 3;
                }).text());
                book[name] = val;
                console.info('name: ' + name + ', val: ' + val);
            });

            book.price = buyDetails.find('span.offer-price').text().trim();
            book.quantity = buyDetails.find('div#selectQuantity').find('select#quantity').val();
            book.shippingCost = buyDetails.find('span.buyboxShippingLabel').text().trim();
            books.push(book);

            json2csv({data: [book], fields: fields, hasCSVColumnTitle: false}, function (err, csv) {
                if (err) console.log(err);
                fs.appendFileSync('./books.csv', csv);
                fs.appendFileSync('./books.csv', '\n');
            });
        });
    });
});