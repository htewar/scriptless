const Console = "/console";
const TestCase = "/test-case";

export const RoutePaths = {
    Console: Console,
    TestCases: (platform: string) => `${Console}/${platform}`,
    NewTestCase: (platform: string) => `${Console}/${platform}/${TestCase}/new`,
    History: (platform: string) => `${Console}/${platform}/history`,
    Recording: (platform: string, id: string) => `${Console}/${platform}/${TestCase}/recording/${id}`,
    Trigger: (platform: string, id: string) => `${Console}/${platform}/${TestCase}/trigger/${id}`,
}