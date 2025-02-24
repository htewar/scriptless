import { TestCase } from "../models/TestCase";
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

    async getTestCases(): Promise<TestCase[]> {
        const response = await fetch(`http://localhost:3000/api/test-case`);
        return response.json();
    }
}

export const apiClient = new ApiClient('http://localhost:3000', "v1");