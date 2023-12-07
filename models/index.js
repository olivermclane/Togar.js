const env = process.env.NODE_ENV || 'dev';
const dbConfig = require(`../config/${env}-db.config.js`);

const logger = require("../config/logger");
const Sequelize = require("sequelize");
const DatabaseCon = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging : msg => logger.debug(msg),

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    define: {
        underscored: true,
    }
});

const database = {};

database.Sequelize = Sequelize;
database.connection = DatabaseCon;

database.users = require('./user.model.js')(database.connection, database.Sequelize);
database.userimage = require('./userImage.model.js')(database.connection, database.Sequelize);

database.users.hasMany(database.userimage, {
    as: 'images',
    foreignKey: {
        name: 'login_id',
        columnName: 'login_id',
        allowNull: false
    }
});

module.exports = database;