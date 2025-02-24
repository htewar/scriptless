import TestCasesApiResponse, {TestCase, TestCaseApiResponse} from "../models/TestCasesApiResponse";
import LoginApiResponse, {User} from "@/app/lib/models/LoginApiResponse";

class ApiClient {
    private readonly baseUrl: string;
    private readonly apiVersion: string;

    constructor(baseUrl: string, apiVersion: string) {
        this.baseUrl = baseUrl;
        this.apiVersion = apiVersion;
    }

    async login(username: string, password: string): Promise<LoginApiResponse> {
        const formData = new FormData();
        formData.append('user_name', username);
        formData.append('password', password);

        const response = await fetch(`${this.baseUrl}/api/${this.apiVersion}/user/authenticate`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            return new LoginApiResponse(false, 'Failed to authenticate user');
        }
        const data = await response.json();
        const message = data.message
        const uid = data.data.uid
        const uname = data.data.username
        const token = data.data.token
        return new LoginApiResponse(true, message, new User(uid, uname, token));
    }

    async getTestCase(uid: string, testCaseId: string): Promise<TestCaseApiResponse> {
        const response = await fetch(`${this.baseUrl}/api/${this.apiVersion}/test-case?uid=${uid}&id=${testCaseId}`);
        const responseData = await response.json();
        if (!response.ok) {
            return new TestCaseApiResponse(true, responseData.message || 'Failed to get test case');
        } else {
            const testCase = responseData.data
            return new TestCaseApiResponse(false, responseData.message, new TestCase(
                testCase.test_case_uuid,
                testCase.uid,
                testCase.test_case_name,
                testCase.app_name,
                testCase.platform,
                testCase.config_path
            ));
        }
    }

    async getTestCases(uid: string, query: string, offset: number): Promise<TestCasesApiResponse> {
        const response = await fetch(`${this.baseUrl}/api/${this.apiVersion}/test-case?uid=${uid}&offset=${offset}&query=${query}`);
        const responseData = await response.json();
        if (!response.ok) {
            return new TestCasesApiResponse(
                true,
                responseData.message,
            )
        } else {
            const testCases: TestCase[] = responseData.data.map((data: {
                test_case_uuid: string;
                uid: string;
                test_case_name: string;
                app_name: string;
                platform: string;
                config_path: string;
            }) => {
                return new TestCase(
                    data.test_case_uuid,
                    data.uid,
                    data.test_case_name,
                    data.app_name,
                    data.platform,
                    data.config_path
                )
            })
            return new TestCasesApiResponse(
                false,
                responseData.message,
                testCases
            )
        }
        // const testCases: TestCase[] = []
        // responseData.data.forEach((data: never) => {
        //     console.log("TestCase Data ===> ", data.test_case_name);
        //     testCases.push(new TestCase(
        //         data.test_case_uuid,
        //         data.uid,
        //         data.test_case_name,
        //         data.app_name,
        //         data.platform,
        //         data.config_path
        //     ))
        // });
        // return testCases;
    }
}

export const apiClient = new ApiClient('http://localhost:3000', "v1");