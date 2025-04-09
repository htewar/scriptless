export class RecordingTestCaseApiResponse {
    senderId: string
    receiverId: string
    screenshotUrl: string
    xmlUrl: string
    receiverMessage: string
    menu: Menu[]

    constructor(
        senderId: string,
        receiverId: string,
        screenshotUrl: string,
        xmlUrl: string,
        receiverMessage: string,
        menu: Menu[]
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
    type: string
    classType: string
    name: string
    title: string
    resourceId: string
    label: string
    contentDesc: string
    enabled: boolean
    visible: boolean
    accessible: boolean
    x: string
    y: string
    width: string
    height: string
    index: string
    clickable: boolean
    xpath: string
    actions: string[]

    constructor(
        type: string,
        classType: string,
        name: string,
        title: string,
        resourceId: string,
        label: string,
        contentDesc: string,
        enabled: boolean,
        visible: boolean,
        accessible: boolean,
        x: string,
        y: string,
        width: string,
        height: string,
        index: string,
        clickable: boolean,
        xpath: string,
        actions: string[]
    ) {
        this.type = type
        this.classType = classType
        this.name = name
        this.title = title
        this.resourceId = resourceId
        this.label = label
        this.contentDesc = contentDesc
        this.enabled = enabled
        this.visible = visible
        this.accessible = accessible
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.index = index
        this.clickable = clickable
        this.xpath = xpath
        this.actions = actions
    }
}