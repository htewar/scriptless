export class TestCase {
    
    uid:  number;
    testCaseUUID: string;
    testcasename: string;
    feature: string;
    config_file: string
    browser: string;
    url: string;
    environment: string;
   

    constructor(
    
    uid: number,
    testCaseUUID: string,
    testcasename: string,
    feature: string,
    config_file : string,
    browser: string,
    url: string,
    environment: string,
    
    ) {
        this.uid = uid;
        this.testCaseUUID = testCaseUUID;
        this.testcasename = testcasename;
        this.feature = feature;
        this.config_file = config_file;
        this.browser = browser;
        this.url = url;
        this.environment = environment;
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