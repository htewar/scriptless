import { TestCase } from "../models/TestCase";
import { Platform } from "../models/Platform";
import { delay } from "../utils/delay";

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async login(username: string, password: string) {

    }

    async getTestCases(): Promise<TestCase[]> {
        // return [
        //     new TestCase(1, Platform.iOS, 'Driver Go Online'),
        //     new TestCase(1, Platform.iOS, 'Driver Go Offline'),
        //     new TestCase(1, Platform.Android, 'Driver Go Online'),
        // ]
        const response = await fetch(`http://localhost:3000/api/test-case`);
        return response.json();
    }

    async recordingTest(id: string, interval: number = 5000): Promise<TestCase> {
        while (true) {
            try {
                const response = await fetch(`${this.baseUrl}/long_polling?xml_file=1734929109031_dump.xml`);
                if (response.ok) {
                    const data = await response.json();
                    return new TestCase(data.id, data.platform, data.methodName);
                } else {
                    console.error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            await delay(interval);
        }
    }
}

export const apiClient = new ApiClient('172.23.132.110:5000');