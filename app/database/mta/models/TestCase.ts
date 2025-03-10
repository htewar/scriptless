import { Model, Op } from 'sequelize'

class TestCase extends Model {
    declare test_case_uuid: string;
    declare uid: string;
    declare test_case_name: string;
    declare app_name: string;
    declare platform: string;
    declare config_path: string;

    static async createTestCase(testCaseUUID: string, uid: string, testCaseName: string, appName: string, platform: string, configPath: string) {
        return await this.create({
            test_case_uuid: testCaseUUID,
            uid: uid,
            test_case_name: testCaseName,
            app_name: appName,
            platform: platform,
            config_path: configPath
        });
    }

    static async getTestCases(searchQuery: string, uid: string | null, offset: number = 0, limit: number = 20) {
        if (uid) {
            return await this.findAll({
                where: {
                    uid: uid,
                    test_case_name: {
                        [Op.like]: `%${searchQuery}%`
                    }
                }, order: [
                    ['updatedAt', 'DESC'],
                ],
                offset: offset,
                limit: limit
            });
        }
        return await this.findAll();
    }

    static async getTestCaseByUUID(testCaseUUID: string) {
        return await this.findOne({ where: { test_case_uuid: testCaseUUID } });
    }

    static async updateTestCase(testCaseUUID: string, testCaseName: string, configPath: string | null) {
        if (configPath) {
            await this.update(
                {
                    test_case_name: testCaseName,
                    config_path: configPath,
                },
                {
                    where: {
                        test_case_uuid: testCaseUUID
                    }
                }
            )
        } else {
            await this.update(
                {
                    test_case_name: testCaseName,
                },
                {
                    where: {
                        test_case_uuid: testCaseUUID
                    }
                }
            )
        }

    }
}

export default TestCase