import { Model } from 'sequelize'

class IndividualStep extends Model {
    declare steps_uuid: string;
    declare bounds: string;
    declare img_screenshot: string;
    declare xml_hierarchy: string;
    declare screen_id: string;
    declare order: number;
    declare test_case_uuid: string;
    declare action: string;
    declare optionals: boolean;
    declare screen_name: string;
    declare order_id: number;
}

export default IndividualStep

// - steps_uuid (primary key)
// - bounds
// - img_screens
// - xml_hierarchy
// - screen_id
// - order
// - test_case_uuid (foreign key of test_case)
// - action
// - optionals
// - screen_name
// - order_id
