"use strict";
exports.__esModule = true;
var Api = /** @class */ (function () {
    function Api(db, timer) {
        this.db = db;
        this.timer = timer;
    }
    Api.prototype.recordFeel = function (feel) {
        this.db.recordFeel(feel, this.timer.now());
    };
    Api.prototype.getFeels = function () {
        return this.db.getFeels();
    };
    return Api;
}());
exports.Api = Api;
var SpreadsheetFeelDB = /** @class */ (function () {
    function SpreadsheetFeelDB(spreadsheet) {
        this.spreadsheet = spreadsheet;
    }
    SpreadsheetFeelDB.prototype.recordFeel = function (feel, timestamp) {
        this.spreadsheet.appendRow([feel, timestamp.toDateString()]);
    };
    SpreadsheetFeelDB.prototype.getFeels = function () {
        var output = [];
        var allData = this.spreadsheet.getValues();
        for (var i = 0; i < allData.length; i++) {
            output.push(allData[i][0]);
        }
        return output;
    };
    return SpreadsheetFeelDB;
}());
exports.SpreadsheetFeelDB = SpreadsheetFeelDB;
function getApi() {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
        return null;
    }
    var dataSheet = spreadsheet.getSheetByName('Raw Feels');
    var feelSheet = spreadsheet.getSheetByName('Feel Names');
    var api = new Api(new SpreadsheetFeelDB({
        getValues: function () {
            return feelSheet.getRange(1, 1, feelSheet.getLastRow(), 1).getDisplayValues();
        },
        appendRow: function (row) {
            dataSheet.appendRow(row);
        }
    }), {
        now: function () { return new Date(); }
    });
    return api;
}
function doGet(e) {
    var api = getApi();
    if (!api) {
        throw new Error("Could not get api");
    }
    var textOutput = ContentService.createTextOutput(JSON.stringify(api.getFeels()));
    textOutput.setMimeType(ContentService.MimeType.JSON);
    return textOutput;
}
function doPost(e) {
    var api = getApi();
    if (!api) {
        throw new Error("Could not get api");
    }
    api.recordFeel(e.parameter.feel);
}
