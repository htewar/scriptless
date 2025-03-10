import {Sequelize, DataTypes} from 'sequelize';
import User from './models/User';
import TestCase from './models/TestCase';
import IndividualStep from './models/IndividualStep';
import PlaySession from './models/PlaySession';
import TestCaseExecution from './models/TestCaseExecution';
import Build from "@/app/database/mta/models/Build";

const sequelize = new Sequelize(
    `${process.env.MYSQL_DATABASE}`,
    `${process.env.MYSQL_USER}`,
    `${process.env.MYSQL_PASSWORD}`,
    {
        host: `${process.env.HOST}`,
        dialect: 'mysql',
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        dialectModule: require('mysql2'),
        define: {
            freezeTableName: true,
        },
    },
);


interface DBConnectionResponse {
    isDBConnected: boolean;
    error?: string;
}

class DBConnection {

    async connect(): Promise<DBConnectionResponse> {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
            return {
                isDBConnected: true,
            };
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            return {
                isDBConnected: false,
                error: error?.toString() || "Unknown error",
            };
        }
    }

    async syncModels() {
        try {
            await this.syncUserModel();
            await this.syncTestCaseModel()
            await this.syncIndividualStepModel();
            await this.syncPlaySessionModel();
            await this.syncTestCaseExecutionModel();
            await this.syncBuildModel();
            console.log('All models were synchronized successfully.');
        } catch (err) {
            console.error('Unable to sync models:', err);
        }
    }

    private async syncBuildModel() {
        Build.init(
            {
                build_uuid: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                uid: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                build_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                ext: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                platform: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                path: {
                    type: DataTypes.STRING,
                    allowNull: false,
                }
            },
            {
                sequelize,
                tableName: 'build',
            }
        );
        User.hasMany(Build, {foreignKey: 'uid'});
        Build.belongsTo(User, {foreignKey: 'uid'});
        await Build.sync({
            alter: true
        })
    }

    private async syncTestCaseExecutionModel() {
        TestCaseExecution.init(
            {
                execution_uuId: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                test_case_uuid: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                uid: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                target_os: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                target_device: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                device_lab: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'test_case_execution',
            }
        )
        User.hasMany(TestCaseExecution, {foreignKey: 'uid'});
        TestCaseExecution.belongsTo(User, {foreignKey: 'uid'});
        TestCase.hasMany(TestCaseExecution, {foreignKey: 'test_case_uuid'});
        TestCaseExecution.belongsTo(TestCase, {foreignKey: 'test_case_uuid'});
        await TestCaseExecution.sync({
            alter: true
        })
    }

    private async syncPlaySessionModel() {
        PlaySession.init(
            {
                playing_token: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                uid: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                recording_token: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                steps: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'play_session',
            }
        )
        User.hasMany(PlaySession, {foreignKey: 'uid'});
        PlaySession.belongsTo(User, {foreignKey: 'uid'});
        TestCase.hasMany(PlaySession, {foreignKey: 'test_case_uuid'});
        PlaySession.belongsTo(TestCase, {foreignKey: 'test_case_uuid'});
        await PlaySession.sync({
            alter: true
        })
    }

    private async syncIndividualStepModel() {
        IndividualStep.init(
            {
                steps_uuid: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                bounds: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                img_screens: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                xml_hierarchy: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                screen_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                order: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                test_case_uuid: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                action: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                optionals: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                screen_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                order_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'individual_step',
            }
        )
        TestCase.hasMany(IndividualStep, {foreignKey: 'test_case_uuid'});
        IndividualStep.belongsTo(TestCase, {foreignKey: 'test_case_uuid'});
        await IndividualStep.sync({
            alter: true
        })
    }

    private async syncTestCaseModel() {
        TestCase.init(
            {
                test_case_uuid: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                uid: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                test_case_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                app_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                platform: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                config_path: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'test_case',
            }
        )
        User.hasMany(TestCase, {foreignKey: 'uid'});
        TestCase.belongsTo(User, {foreignKey: 'uid'});
        await TestCase.sync({alter: true})
    }

    private async syncUserModel() {
        User.init(
            {
                uid: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                username: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                token: {
                    type: DataTypes.STRING,
                    allowNull: true,
                }
            },
            {
                sequelize,
                tableName: 'user',
            }
        )
        await User.sync({alter: true})
    }
}

const dbConnection = new DBConnection()
export default dbConnection;