module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user',{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        username: {
            type: Sequelize.STRING,
            notNull: true,
            unique: true
        }
    })
}

