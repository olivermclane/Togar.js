// Exports the sequelize model for  a user, which stores the ID of the user and the username for the user.
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user',{
        //Primary key is a integer and auto increments add new entries occur.
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        //Username for identification
        username: {
            type: Sequelize.STRING,
            notNull: true,
            unique: true
        },
    });
    return User;
}

