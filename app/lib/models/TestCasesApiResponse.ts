export class TestCase {
    testCaseUUID: string;
    uid: string;
    testCaseName: string;
    appName: string;
    platform: string;
    configPath: string;

    constructor(
        testCaseUUID: string,
        uid: string,
        testCaseName: string,
        appName: string,
        platform: string,
        configPath: string
    ) {
        this.testCaseUUID = testCaseUUID;
        this.uid = uid;
        this.testCaseName = testCaseName;
        this.appName = appName;
        this.platform = platform;
        this.configPath = configPath;
    }
}

export class CreateTestCaseApiResponse {
    isError: boolean;
    errorMessage?: string;
    testCase?: TestCase
    constructor(
        isError: boolean,
        errorMessage?: string,
        testCase?: TestCase,

    ) {
        this.isError = isError;
        this.errorMessage = errorMessage;
        this.testCase = testCase;
    }
}

export class TestCaseApiResponse {
    isError: boolean;
    errorMessage?: string;
    data?: TestCase
    constructor(
        isError: boolean,
        errorMessage?: string,
        testCase?: TestCase,

    ) {
        this.isError = isError;
        this.errorMessage = errorMessage;
        this.data = testCase;
    }
}

export default class TestCasesApiResponse {
    isError: boolean;
    errorMessage?: string;
    testCases: TestCase[] = []
    constructor(
        isError: boolean,
        errorMessage?: string,
        testcases: TestCase[] = []
    ) {
        this.isError = isError;
        this.errorMessage = errorMessage;
        this.testCases = testcases;
    }
}