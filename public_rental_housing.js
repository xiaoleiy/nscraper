/**
 * Created by xiaoleiyu on 15-11-5.
 */

var fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    _ = require('underscore'),
    eventproxy = require('eventproxy'),
    urlRentalHousing = 'http://gzfa.xdz.com.cn/ModuleBook/PersonSelectRoom/GetRoomCountByRoomType/';

/**
 * The list of communities
 */
var uuid = {
    /** The UUID of communities **/
    lanBoA: 'd0c18b09-39a0-4fde-adbb-a44f01276fa6',
    lanBoB: '3fec5392-a75a-43db-9dd0-a0970100a6d2',
    hanFeng: '19b0f030-53c2-49f2-b20a-a3cd00ee7aeb',

    /** The UUID of building No. and room No. **/
    jinYeBuildings: [{
        id: 'a14b374b-bb3b-4b78-b574-a3c600a44858',
        name: '1号楼',
        rooms: [{
            id: '9e6fed87-a185-4040-b4ff-a3c600a41758',
            name: '锦1号楼A'
        }]
    }, {
        id: '09833413-73af-4ae4-9e0b-a3c600a5d182',
        name: '2号楼',
        rooms: [
            {
                id: '2ba8e032-907f-45f1-9a9a-a3c600a58dbe',
                name: '锦2号楼A'
            }]
    }, {
        id: '7010a8ce-8fca-401d-a0d4-a3c601114e8c',
        name: '3号楼',
        rooms: [{
            id: '42e3462c-aab6-4237-a2de-a3c60108a329',
            name: '锦3号楼A'
        }, {
            id: '622de26b-e7c2-44c8-a37c-a3c60108d092',
            name: '锦3号楼B'
        }, {
            id: 'a5c842f0-edf4-4220-9c3a-a3c60109accf',
            name: '锦3号楼C'
        }, {
            id: '81067aaa-cc53-44f0-89fe-a3c60109c80e',
            name: '锦3号楼D'
        }, {
            id: '12223f6d-256e-4d3d-a467-a3c60109f743',
            name: '锦3号楼A1'
        }, {
            id: '28db79cb-d37f-4c80-ad71-a3c601090d8b',
            name: '锦3号楼B1'
        }]
    }, {
        id: 'bb88fc41-736e-49d4-964b-a3c60111b613',
        name: '4号楼',
        rooms: [{
            id: '193f32e1-5ad4-4e6a-adf8-a3c6010d406e',
            name: '锦4号楼A'
        }, {
            id: '1724fe64-1658-4188-b6f8-a3c6010dc676',
            name: '锦4号楼B'
        }, {
            id: 'c8c02138-0ad1-4157-ad95-a3c6010de4a3',
            name: '锦4号楼C'
        }, {
            id: '62407d64-15ed-4284-8ea0-a3c6010e18e1',
            name: '锦4号楼D'
        }, {
            id: '76d43803-b28f-4105-a189-a3c6010e97fd',
            name: '锦4号楼A1'
        }, {
            id: '268607f0-2921-496f-be79-a3c6010ed534',
            name: '锦4号楼B1'
        }]
    }, {
        id: 'd54adc0d-9a44-478e-84d0-a3c60111e21c',
        name: '5号楼',
        rooms: [{
            id: 'c959ca5a-fc88-4d18-ae2c-a3c6010f0fa6',
            name: '锦5号楼A'
        }, {
            id: 'fcc14689-29f9-4be6-8f63-a3c6010f27f3',
            name: '锦5号楼B'
        }, {
            id: '61cf44f3-8b25-4ef9-b502-a3c6010f688c',
            name: '锦5号楼C'
        }, {
            id: '216b5603-7903-4da0-a957-a3c6010f82ea',
            name: '锦5号楼D'
        }, {
            id: '5ff39954-fd3a-4df0-829b-a3c6010fca20',
            name: '锦5号楼A1'
        }, {
            id: '98f8b041-9543-4e86-866d-a3c6010fdfc9',
            name: '锦5号楼B1'
        }]
    }]
};

/**
 * The list of selectors
 */
var selector = {
    /** The search inputs **/
    containerSearch: '.search-container',
    selectBuilding: '#BuildingID',
    selectRoomType: '#RoomTypeID',

    /** The building blocks grid **/
    containerBuildingBlocks: 'building-container',
    room: '.room-data'
};

/**
 * The list of HTML DOM attributes
 */
var attr = {
    roomNo: 'room-no',
    roomOrientation: 'houseorientation'
};

_.each(uuid.jinYeBuildings, function (building) {

    _.each(building.rooms, function (room) {
        console.info('starting to request the building ' + building.name + ' room ' + room.name);

        request.post({
            url: urlRentalHousing,
            form: {
                buildid: building.id,
                roomtypeid: room.id
            }
        }, function (err, httpResponse, body) {
            if (err) console.error('Error occurred when requesting the available rooms!', err);

            var resp = JSON.parse(body);
            console.info('Available room for building ' + building.name + ' room ' + room.name + ': ' + resp.result);
        });
    });
});

// request all the brands
//request(urlRentalHousing + uuid.jinYeBuildings, function (err, response, body) {
//    if (err) console.log('We’ve encountered an error: ' + error);
//
//    var $ = cheerio.load(body);
//    var validRooms = $(selector.containerBuildingBlocks).find(selector.room + ':parent');
//    if (validRooms && !validRooms.isEmpty()) {
//        console.info('The valid rooms are: ');
//        var allValidRoomNos = validRooms.attr(attr.roomNo);
//        _.each(allValidRoomNos, function(validRoomNo) {
//            console.info('')
//        });
//    }
//
//    console.info('No valid room found!');
//});