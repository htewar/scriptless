export class TestCaseElement {
    elementIndex: number
    resourceId: string
    elementClass: string
    elementTitle: string
    contentDescription: string
    elementActions: string[]

    constructor(
        elementIndex: number,
        resourceId: string,
        elementClass: string,
        elementTitle: string,
        contentDescription: string,
        elementActions: string[]
    ) {
        this.elementIndex = elementIndex
        this.resourceId = resourceId
        this.elementClass = elementClass
        this.elementTitle = elementTitle
        this.contentDescription = contentDescription
        this.elementActions = elementActions
    }

}