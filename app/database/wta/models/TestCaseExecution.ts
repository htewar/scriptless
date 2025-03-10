import { Model } from 'sequelize';

class TestCaseExecution extends Model {
    declare execution_uuId: string;
    declare test_case_uuid: string;
    declare uid: string;
    declare target_env: string;
    // declare target_device: string;
}

export default TestCaseExecution