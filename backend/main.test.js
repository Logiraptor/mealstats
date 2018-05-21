"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var main_1 = require("./main");
chai_1.use(sinonChai);
describe('Api', function () {
    describe('#recordFeel', function () {
        it('persists a feel', function () {
            var db = {
                recordFeel: sinon.spy()
            };
            var testDate = new Date();
            var timer = {
                now: function () { return testDate; }
            };
            var api = new main_1.Api(db, timer);
            var feel = 'Delicious';
            api.recordFeel(feel);
            chai_1.expect(db.recordFeel).to.have.been.calledWith(feel, testDate);
        });
    });
});
describe('SpreadsheetFeelDB', function () {
    describe('#recordFeel', function () {
        it('appends a spreadsheet row', function () {
            var spreadsheet = {
                appendRow: sinon.spy()
            };
            var subject = new main_1.SpreadsheetFeelDB(spreadsheet);
            var date = new Date();
            subject.recordFeel('Bad', date);
            chai_1.expect(spreadsheet.appendRow).to.have.been.calledWith(['Bad', date.toISOString()]);
        });
    });
});
