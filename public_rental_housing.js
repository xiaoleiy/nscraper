/**
 * Created by xiaoleiyu on 15-11-5.
 */

var fs = require('fs'),
    request = require("request"),
    cheerio = require("cheerio"),
    _ = require('underscore'),
    eventproxy = require('eventproxy'),
    urlRentalHousing = 'http://gzfa.xdz.com.cn/ModuleBook/PersonSelectRoom/Index?CommunityID=';

/**
 * The list of communities
 */
var uuid = {
    /** The UUID of communities **/
    lanBoA: 'd0c18b09-39a0-4fde-adbb-a44f01276fa6',
    lanBoB: '3fec5392-a75a-43db-9dd0-a0970100a6d2',
    jinYe: 'e46fe9e8-bd85-4b87-b68d-a3c501146273',
    hanFeng: '19b0f030-53c2-49f2-b20a-a3cd00ee7aeb',

    /** The UUID of building No. and room No. **/
    commJinye: {
        /** The No. of Community -> Buildings **/
        buildings: ['a14b374b-bb3b-4b78-b574-a3c600a44858',
            '09833413-73af-4ae4-9e0b-a3c600a5d182',
            '7010a8ce-8fca-401d-a0d4-a3c601114e8c',
            'bb88fc41-736e-49d4-964b-a3c60111b613',
            'd54adc0d-9a44-478e-84d0-a3c60111e21c'
        ],

        /** The No. of Community -> Buildings -> Units **/
        units: [
            '9e6fed87-a185-4040-b4ff-a3c600a41758',
            '2ba8e032-907f-45f1-9a9a-a3c600a58dbe',
            '42e3462c-aab6-4237-a2de-a3c60108a329',
            '622de26b-e7c2-44c8-a37c-a3c60108d092',
            '28db79cb-d37f-4c80-ad71-a3c601090d8b',
            'a5c842f0-edf4-4220-9c3a-a3c60109accf',
            '81067aaa-cc53-44f0-89fe-a3c60109c80e',
            '12223f6d-256e-4d3d-a467-a3c60109f743',
            '193f32e1-5ad4-4e6a-adf8-a3c6010d406e',
            '1724fe64-1658-4188-b6f8-a3c6010dc676',
            'c8c02138-0ad1-4157-ad95-a3c6010de4a3',
            '62407d64-15ed-4284-8ea0-a3c6010e18e1',
            '76d43803-b28f-4105-a189-a3c6010e97fd',
            '268607f0-2921-496f-be79-a3c6010ed534',
            'c959ca5a-fc88-4d18-ae2c-a3c6010f0fa6',
            'fcc14689-29f9-4be6-8f63-a3c6010f27f3',
            '61cf44f3-8b25-4ef9-b502-a3c6010f688c',
            '216b5603-7903-4da0-a957-a3c6010f82ea',
            '5ff39954-fd3a-4df0-829b-a3c6010fca20',
            '98f8b041-9543-4e86-866d-a3c6010fdfc9'
        ]
    }
};

/**
 * The list of selectors
 */
var selector = {
    /** The search inputs **/
    containerSearch: '.search-container',
    selectBuilding: '#BuildingID',
    selectRoomType: '#RoomTypeID',
    btnSearchSubmit: 'input[type="submit"]',

    /** The building blocks grid **/
    containerBuildingBlocks: 'building-container',
    roomBlock: '.room-data'
};

/**
 * The list of HTML DOM attributes
 */
var attr = {
    roomNo: 'room-no',
    roomOrientation: 'houseorientation'
};

// request all the brands
request(urlRentalHousing + uuid.jinYe, function (err, response, body) {
    if (err) console.log("We’ve encountered an error: " + error);

    var $ = cheerio.load(body);
    var allRoomBlocks = $(selector.containerBuildingBlocks).find(selector.roomBlock);
});