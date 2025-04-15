import {
    CreateTestCaseApiResponse,
    TestCase
} from "../models_wta/TestCasesApiResponse";

class ApiClient {
    private readonly baseUrl: string;
    private readonly apiVersion: string;

    constructor(baseUrl: string, apiVersion: string) {
        this.baseUrl = baseUrl;
        this.apiVersion = apiVersion;
    }

    async addNewTestCase(formData: any): Promise<CreateTestCaseApiResponse> {
        console.log("api req formData in addnewtestmethod:: ", formData);
        const dataToSend = new FormData();

        Object.keys(formData).forEach(key => {
            const value = formData[key];
            dataToSend.append(key, value);
        });
        console.log("api req dataToSend",dataToSend);
        for (let [key, value] of dataToSend.entries()) {
            console.log(key, value); // Log each key and its corresponding value
        }
        const response = await fetch(`${this.baseUrl}/api/${this.apiVersion}/wta/test-case`, {
            method: 'POST',
            body: dataToSend,
        });
        console.log("api response :: ", response);
        const responseData = await response.json();
        const responseMessage = await responseData.message;
        console.log("Create Test Case Response :: ", responseMessage)
        if (!response.ok) {
            console.log("response.ok",response.ok);
            return new CreateTestCaseApiResponse(true, responseMessage);
        } else {
            const testCase = await responseData.data;
            console.log("testCase.ok",testCase);
            return new CreateTestCaseApiResponse(false, responseMessage, new TestCase(
                testCase.uid,
                testCase.test_case_uuid,
                testCase.test_case_name,
                testCase.feature_name,
                testCase.config_file,
                testCase.browser,
                testCase.url,
                testCase.environment,
            ));
        }
    }
}
export const apiClient = new ApiClient(`http://localhost:3000`, "v1");