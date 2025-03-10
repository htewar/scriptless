import { Model } from 'sequelize'

class IndividualStep extends Model {
    declare steps_uuid: string;
    declare img_screens: string;
    declare json_hierarchy: string;
    declare page_id: string;
    declare order: number;
    declare test_case_uuid: string;
    declare action: string;
    declare optionals: string;
    declare page_name: string;
    declare order_id: number;
}

export default IndividualStep

// - steps_uuid (primary key)
// - img_screens
// - json_hierarchy
// - page_id
// - order
// - test_case_uuid (foreign key of test_case)
// - action
// - optionals
// - page_name
// - order_id