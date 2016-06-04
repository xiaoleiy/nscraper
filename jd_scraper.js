(function () {
    var fs = require('fs'),
        request = require("request"),
        cheerio = require("cheerio"),
        _ = require('underscore'),
        eventproxy = require('eventproxy'),
        json2csv = require('json2csv'),
        baseURL = 'http://item.jd.com/';

    //var allItems = [2504153];
    var allItems = [2504153, 1595878, 1300259, 1231901, 2169922, 1277622, 1096587, 1150537, 1121677, 1262913, 316916, 316920, 1277632];

    function download(zoomImgSrc, dir, filename) {
        request.head(zoomImgSrc, function (err, res, body) {
            request(zoomImgSrc).pipe(fs.createWriteStream(dir + "/" + filename));
        });
    }

    function fileExt(filename)
    {
        var lastIdx = filename.lastIndexOf('.');
        return filename.substring(lastIdx + 1);
    }

    _.each(allItems, function (productNo, idx) {
        var prodctURL = baseURL + productNo + ".html";

        console.info('requesting ' + prodctURL);

        // request all the brands
        request(prodctURL, function (err, response, body) {
            if (err) console.log("We’ve encountered an error: " + error);

            var $ = cheerio.load(body);
            var productIntro = $('#product-intro');
            var zoomImg = productIntro.find('.jqzoom').find('img');
            var zoomImgSrc = 'http:' + zoomImg.attr('src');
            var zoomImgExt = fileExt(zoomImgSrc);
            var price = $(productIntro).find('#jd-price').html();
            //console.info('Zoom img url: ' + zoomImgSrc + ' with price: ' + price + ', and image: ');

            var itemBasedir = './images/' + productNo;
            if (!fs.existsSync(itemBasedir))
            {
                fs.mkdirSync(itemBasedir);
            }
            //download(zoomImgSrc, itemBasedir, "0." + zoomImgExt);

            var specImgList = productIntro.find('#spec-list').find('img');
            _.each(specImgList, function (specImg, idx) {
                var specImgUrl = 'http:' + $(specImg).attr('src');
                specImgUrl = specImgUrl.replace(/\/n5\//, '/n1/');
                console.info('specImgUrl: ' + specImgUrl);
                var specImgExt = fileExt(zoomImgSrc);
                download(specImgUrl, itemBasedir,  (idx+1) + '.' + specImgExt);
            });

            //var productDetail = $('#product-detail');
            //var detailImgs = productDetail.find('.detail-content-item').find('#J-detail-content').find('.formwork .formwork_img').find('img').attr('src');
            //_.each(detailImgs, function (imgSrc, idx) {
            //    console.info('#' + idx + ': ' + imgSrc);
            //});

            //ep.emit('brands', null);
        });
    });
})();