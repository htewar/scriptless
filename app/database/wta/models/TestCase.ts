import { Model, Op } from 'sequelize'

class TestCase extends Model {
    declare test_case_uuid: string;
    declare uid: number;
    declare test_case_name: string;
    declare feature_name: string;
    declare browser: string;
    declare config_file: string;
    declare url :string;
    declare environment :string;

    static async createTestCase(uid :number,testCaseUUID: string, testCaseName: string, featureName: string, browser: string, configFile: string, url: string,environment: string) {
       const newTestCase =  await this.create({
            uid :uid,
            test_case_uuid: testCaseUUID,
            test_case_name: testCaseName,
            feature_name: featureName,
            browser: browser,
            config_file: configFile,
            url:url,
            environment: environment,
        });
        console.log("newTestCase",newTestCase);
        return newTestCase;
        
    }
   
}

export default TestCase