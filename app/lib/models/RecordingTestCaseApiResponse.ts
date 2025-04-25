export class RecordingTestCaseApiResponse {
    constructor(
        public clientId: string,
        public uid: string,
        public screenshotUrl: string,
        public xmlUrl: string,
        public receiverMessage: string,
        public menu: Menu[],
        public allMenu: Menu[],
        public stepUUID: string,
        public screenshotDimensions: { width: number; height: number }
    ) {}
}

export class Menu {
    constructor(
        public type: string,
        public classType: string,
        public name: string | null,
        public title: string | null,
        public text: string | null,
        public resourceId: string | null,
        public label: string | null,
        public contentDesc: string | null,
        public enabled: boolean,
        public visible: boolean,
        public accessible: boolean,
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        public index: number,
        public clickable: boolean,
        public xpath: string | null,
        public actions: string[],
        public bounds: string | null = null
    ) {}
}