import { Model } from 'sequelize';

class TestCaseExecution extends Model {
    declare execution_uuId: string;
    declare test_case_uuid: string;
    declare uid: string;
    declare target_os: string;
    declare target_device: string;
    declare device_lab: string;
}

export default TestCaseExecution