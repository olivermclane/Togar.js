const database = require('../models');
const User = database.users;
const Op = database.Sequelize.Op;
const where = database.Sequelize.where;

async function findUserByUsername(username) {
    try {
        users = await User.findAll({ where: {username: username} });
        return (users instanceof Array) ? users[0] : null;
    }
    //Catching Exceptions
    catch (ex) {
        throw ex;
    }
}

exports.createNewUser = async function createNewUser(username) {
    user = null;
    if(username) {
        user = await findUserByUsername(username);
    }
    //Creating the user in this instance (Similar to my previous project)
    if(user == null) {
        const newUser = {
            username: username,
        }
        User.create(newUser)
            .catch(err => {
                console.log(err)
                return false;
            });
        return true;
    } else {
        //If user is in database login.
        if(user != null) {
            return true;
        } else {
            return false;
        }
    }
}










