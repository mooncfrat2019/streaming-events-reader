import {DataTypes, Sequelize} from 'sequelize';
import {config} from "./config";

const sequelize = new Sequelize(config.DB_NAME, config.DB_USER_NAME, config.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

export const init_databse = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        await DATA.sync();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export const DATA = sequelize.define('Data', {
    // Model attributes are defined here
    event: {
        type: DataTypes.JSON,
        allowNull: false
    },
}, {
    // Other model options go here
});
