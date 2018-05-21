import {expect, use} from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import {Api, FeelDB, ISpreadsheet, SpreadsheetFeelDB, Timer} from './main'


use(sinonChai)

describe('Api', () => {
    describe('#recordFeel', () => {
        it('persists a feel', () => {
            const db: FeelDB = {
                recordFeel: sinon.spy(),
                getFeels: () => []
            }

            let testDate = new Date()
            const timer: Timer = {
                now: () => testDate,
            }

            const api = new Api(db, timer)
            const feel = 'Delicious'
            api.recordFeel(feel)

            expect(db.recordFeel).to.have.been.calledWith(feel, testDate)
        })
    })

    describe('#getFeels', () => {
        it('returns feels from the db', () => {
            const db: FeelDB = {
                recordFeel: () => {},
                getFeels: () => ['Feel 1', 'Feel 2']
            }
            const timer: Timer = {
                now: () => new Date()
            }
            const subject = new Api(db, timer)
            const result = subject.getFeels()
            expect(result).to.eql(['Feel 1', 'Feel 2'])
        })
    })
})

describe('SpreadsheetFeelDB', () => {
    describe('#recordFeel', () => {
        it('appends a spreadsheet row', () => {
            const spreadsheet: ISpreadsheet = {
                appendRow: sinon.spy(),
                getValues: () => []
            }

            const subject  = new SpreadsheetFeelDB(spreadsheet)
            let date = new Date()
            subject.recordFeel('Bad', date)
            expect(spreadsheet.appendRow).to.have.been.calledWith(['Bad', date.toDateString()])
        })
    })

    describe('#getFeels', () => {
        it('returns the feels from a spreadsheet', () => {
            const spreadsheet: ISpreadsheet = {
                appendRow: sinon.spy(),
                getValues: () => [['Feel 1'], ['Feel 2']]
            }

            const subject  = new SpreadsheetFeelDB(spreadsheet)
            let result = subject.getFeels()
            expect(result).to.eql(['Feel 1', 'Feel 2'])
        })
    })
})
