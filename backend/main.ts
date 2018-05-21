export class Api {
    constructor(private db: FeelDB, private timer: Timer) {
    }

    recordFeel(feel: string) {
        this.db.recordFeel(feel, this.timer.now())
    }

    getFeels(): string[] {
        return this.db.getFeels()
    }
}

export interface FeelDB {
    recordFeel(feel: string, timestamp: Date): void
    getFeels(): string[]
}

export interface Timer {
    now(): Date
}

export interface ISpreadsheet {
    appendRow(contents: string[]): void
    getValues(): string[][]
}

export class SpreadsheetFeelDB implements FeelDB {
    constructor(private spreadsheet: ISpreadsheet) {
    }

    recordFeel(feel: string, timestamp: Date): void {
        const lock = LockService.getDocumentLock()
        this.spreadsheet.appendRow([feel, timestamp.toDateString()])
        lock.releaseLock()
    }

    getFeels(): string[] {
        const output = []
        const allData = this.spreadsheet.getValues()
        for (let i = 0; i < allData.length; i++) {
            output.push(allData[i][0])
        }
        return output
    }
}

interface Request {
    parameter: { [x: string]: string }
}

function getApi() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    if (!spreadsheet) {
        return null
    }
    const dataSheet = spreadsheet.getSheetByName('Raw Feels')
    const feelSheet = spreadsheet.getSheetByName('Feel Names')
    const api = new Api(new SpreadsheetFeelDB({
        getValues() {
            return feelSheet.getRange(1, 1, feelSheet.getLastRow(), 1).getDisplayValues()
        },
        appendRow(row: string[]) {
            dataSheet.appendRow(row)
        },
    }), {
        now: () => new Date(),
    })
    return api
}

function doGet(e: Request) {
    const api = getApi()
    if (!api) {
        throw new Error("Could not get api")
    }
    let textOutput = ContentService.createTextOutput(JSON.stringify(api.getFeels()))
    textOutput.setMimeType(ContentService.MimeType.JSON)
    return textOutput
}

function doPost(e: Request) {
    const api = getApi()
    if (!api) {
        throw new Error("Could not get api")
    }
    api.recordFeel(e.parameter.feel)
}
