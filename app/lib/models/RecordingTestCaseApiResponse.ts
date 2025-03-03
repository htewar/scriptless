import {TestCaseElement} from "@/app/lib/models/TestCaseElement";

export class RecordingTestCaseApiResponse {
    senderId: string
    receiverId: string
    screenshotUrl: string
    xmlUrl: string
    receiverMessage: string
    menu: Menu

    constructor(
        senderId: string,
        receiverId: string,
        screenshotUrl: string,
        xmlUrl: string,
        receiverMessage: string,
        menu: Menu
    ) {
        this.senderId = senderId
        this.receiverId = receiverId
        this.screenshotUrl = screenshotUrl
        this.xmlUrl = xmlUrl
        this.receiverMessage = receiverMessage
        this.menu = menu
    }
}

export class Menu {
    elements: TestCaseElement[]

    constructor(
        elements: TestCaseElement[]
    ) {
        this.elements = elements
    }
}