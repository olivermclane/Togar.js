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

exports.login = async (req, res) => {
    console.log(req.body) // Logging request
    if ((!req.body.username)) {
        //Response if request body doesn't include a Username,
        //theoretically should never happen
        res.status(400).send({
            message: 'Please provide valid username or json format'
        });
        return;
    }
    user = null;
    if(req.body.username) {
        user = await findUserByUsername(req.body.username);
    }
    //Creating the user in this instance (Similar to my previous project)
    if(user == null) {
        const newUser = {
            username: req.body.username,
        }
        User.create(newUser)
            .then(data => {
                res.send({
                    message: "Signup Successful! Your username is @" + newUser.username,
                });
            })
            .catch(err => {
                //If database throws issues with creating entry, we will throw a 500 error.
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while signing you up.",
                    errObj: err
                });
            });
    } else {
        //If user is in database login.
        if(user != null) {
            res.status(200).send({
                message: "Login Successful: Welcome back: " + user.username,
            })
        } else {
            res.status(403).send({
                message: "An error as occurred during Sign-In"
            });
        }
    }
}
