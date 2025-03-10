import {Model} from 'sequelize'

class Build extends Model {
    declare build_uuid: string;
    declare uid: string;
    declare build_name: string;
    declare ext: string;
    declare browser: string;
    declare path: string;

    static async createBuild(buildUUID: string, uid: string, buildName: string, ext: string, browser: string, path: string) {
        return await this.create({
            build_uuid: buildUUID,
            uid: uid,
            build_name: buildName,
            ext: ext,
            browser: browser,
            path: path
        });
    }

    static async getBuilds(uid: string) {
        return await this.findAll({where: {uid: uid}});
    }

    static async getBuild(buildUUID: string) {
        return await this.findOne({where: {build_uuid: buildUUID}});
    }

    static async deleteBuild(buildUUID: string) {
        return await this.destroy({where: {build_uuid: buildUUID}});
    }
}

export default Build