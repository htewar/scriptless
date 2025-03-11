import TestCasesApiResponse, {
    CreateTestCaseApiResponse,
    TestCase,
    TestCaseApiResponse
} from "../models/TestCasesApiResponse";
import LoginApiResponse, {User} from "@/app/lib/models/LoginApiResponse";
import {Build, GetBuildsApiResponse} from "@/app/lib/models/GetBuildsApiResponse";
import {Menu, RecordingTestCaseApiResponse} from "@/app/lib/models/RecordingTestCaseApiResponse";
import {TestCaseElement} from "../models/TestCaseElement";

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
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
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
        const response = await fetch(`${this.baseUrl}/api/${this.apiVersion}/mobile/test-case?uid=${uid}&id=${testCaseId}`);
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
        const response = await fetch(`${this.baseUrl}/api/${this.apiVersion}/mobile/test-case?uid=${uid}&offset=${offset}&query=${query}`);
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
    }

    async getBuilds(uid: string): Promise<GetBuildsApiResponse> {
        const response = await fetch(`${this.baseUrl}/api/${this.apiVersion}/mobile/builds?uid=${uid}`);
        const responseData = await response.json();
        if (!response.ok) {
            return new GetBuildsApiResponse(responseData.message, []);
        } else {
            const builds: Build[] = responseData.builds.map((data: {
                build_uuid: string;
                uid: string;
                build_name: string;
                ext: string;
                platform: string;
                path: string,
                updatedAt: string
            }) => {
                return new Build(
                    data.build_uuid,
                    data.uid,
                    data.build_name,
                    data.ext,
                    data.platform,
                    data.path,
                    data.updatedAt
                )
            })
            return new GetBuildsApiResponse(responseData.message, builds);
        }
    }

    async addNewTestMethod(formData: FormData): Promise<CreateTestCaseApiResponse> {
        const response = await fetch(`${this.baseUrl}/api/${this.apiVersion}/mobile/test-case`, {
            method: 'POST',
            body: formData,
        });
        const responseData = await response.json();
        const responseMessage = await responseData.message;
        console.log("Create Test Case Response :: ", responseMessage)
        if (!response.ok) {
            return new CreateTestCaseApiResponse(true, responseMessage);
        } else {
            const testCase = await responseData.data;
            return new CreateTestCaseApiResponse(false, responseMessage, new TestCase(
                testCase.test_case_uuid,
                testCase.uid,
                testCase.test_case_name,
                testCase.app_name,
                testCase.platform,
                testCase.config_path
            ));
        }
    }

    async uploadBuild(formData: FormData): Promise<void> {
        const response = await fetch(`${this.baseUrl}/api/${this.apiVersion}/mobile/builds`, {
            method: 'POST',
            body: formData,
        });
        console.log("Build upload response :: ", response)
        if (!response.ok) {
            throw new Error('Failed to upload build');
        }
    }

    async deleteBuild(uid: string, buildName: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/api/${this.apiVersion}/mobile/builds/?uid=${uid}&build=${buildName}`, {
            method: 'DELETE',
        });
        console.log("Delete Response :: ", response)
        if (!response.ok) {
            throw new Error('Failed to delete build');
        }
    }

    async updateTestCase(formData: FormData): Promise<TestCaseApiResponse> {
        const response = await fetch(`${this.baseUrl}/api/${this.apiVersion}/mobile/test-case/edit`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            return new TestCaseApiResponse(true, 'Failed to update test case');
        } else {
            return new TestCaseApiResponse(false, 'Failed to update test case');
        }
    }

    async recording(uid: string, testCaseUUID: string): Promise<RecordingTestCaseApiResponse | null> {
        const endpoint = `http://127.0.0.1:5000/long_polling?client_id=${testCaseUUID}`;
        try {
            const response = await fetch(endpoint, {
                method: 'GET',
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("Long polling res :: ", responseData);
                if (responseData.message != 'Timeout') {
                    const message = responseData.message;
                    const elements: TestCaseElement[] = [];
                    for (const menu of message.menu.elements) {
                        elements.push(
                            new TestCaseElement(
                                menu.index,
                                menu["resource-id"],
                                menu.class,
                                menu.title,
                                menu["content-desc"],
                                menu.actions
                            )
                        );
                    }
                    return new RecordingTestCaseApiResponse(
                        responseData.client_id,
                        uid,
                        message.screenshot_url,
                        message.xml_url,
                        message.receiverMessage || '',
                        new Menu(elements)
                    );
                } else {
                    return null
                }
            } else {
                return null
            }
        } catch (e) {
            console.log(e);
            return null
        }
    }
}

export const apiClient = new ApiClient(`http://192.168.68.101:3000`, "v1");
