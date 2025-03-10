import { Model } from 'sequelize'

class User extends Model {
    declare uid: string;
    declare username: string;
    declare token: string;

    static async createUser(uid: string, username: string, token: string) {
        try {
            return await User.create({ uid, username, token });
        } catch (error) {
            throw error;
        }
    }

    static async getUserByID(uid: string) {
        try {
            return await User.findByPk(uid);
        } catch (error) {
            throw error;
        }
    }

    static async authenticateUser(userName: string) {
        try {
            return await User.findOne({ where: { username: userName } });
        } catch (error) {
            throw error;
        }
    }
}

export default User

