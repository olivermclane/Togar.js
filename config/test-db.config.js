module.exports = {
    DB: 'test_database',
    USER: 'test_user',
    PASSWORD: 'test_password',
    HOST: 'localhost',
    dialect: 'sqlite',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
};