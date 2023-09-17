const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const TogarSerializer = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const database = {};

database.Sequelize = Sequelize;
database.connection = TogarSerializer;

database.users = require('./user.model.js')(database.connection, database.Sequelize);
module.exports = database;