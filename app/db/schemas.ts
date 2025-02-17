import { Sequelize, DataTypes, Model } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './app/db/database.sqlite' // Specify the path to your SQLite database file
});

class TestCase extends Model {
    public id!: number;
    public platform!: string;
    public methodName!: string;
}

TestCase.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        platform: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        methodName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { sequelize, modelName: 'TestCase' },
);

class DBClient {
    constructor() { }

    async initDataBase() {
        await sequelize.sync();
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    async insertTempTestCases() {
        await TestCase.sync({ force: true });
        await TestCase.create({
            platform: 'iOS',
            methodName: 'Driver Go Online',
        });
        await TestCase.create({
            platform: 'Android',
            methodName: 'Driver Go Offline',
        });
    }

    async getTestCases() {
        return await TestCase.findAll();
    }
}

export default new DBClient();