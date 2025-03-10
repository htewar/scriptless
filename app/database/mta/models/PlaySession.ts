import { Model } from 'sequelize';

class PlaySession extends Model {
    declare playing_token: string;
    declare uid: string;
    declare recording_token: string;
    declare steps: string;
}

export default PlaySession

// - playing_token (primary key)
// - uid (foreign key of user)
// - recording_token
// - steps (array of individual_steps)