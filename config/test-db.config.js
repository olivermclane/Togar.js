module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "testing123",
    DB: "testingdb",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};