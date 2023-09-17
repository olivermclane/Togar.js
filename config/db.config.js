module.exports = {
    HOST: "localhost",
    USER: "pg-togar",
    PASSWORD: "Togar123",
    DB: "togarjsdatabase",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};