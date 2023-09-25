const database = require('../models/');
const passport = require("passport");

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


const registerUserView = (req, res) => {
    res.render("register", {
    });
}
const registerUser = (req, res) => {
    const { username } = req.body;
    if(!username){
        res.status(409).send("Fields Left Blank")
        console.log("Registration Fields Left Empty")
    }else{
        findUserByUsername(username).then((user) => {
            if(user){
                res.status(409).send("User Creation Failed: Username Already Exist")
                console.log("Account already exist with:" + username)
            }else{
                const newUser = {
                    username: username,
                }
                User.create(newUser)
                    .then(res.status(201).redirect("/login"))
                    .catch(err => {
                        console.log(err)
                    });
            }
        })
    }
}

const loginUserView = (req ,res) => {
    res.render("login", {
    });
}

const loginUser = (req, res, next) => {
    const {username} = req.body;
    console.log(username);
    if (!username) {
        console.log("Please provided all the valid fields: (username)");
        res.render("login", {
            username,
        });
    }else {
        console.log("auth started");
        passport.authenticate("local", {
            successRedirect: "/togar",
            failureRedirect: "/login",
            failureFlash: true
        })(req,res,next);
    }
};


module.exports = {
    registerUserView,
    registerUser,
    loginUserView,
    loginUser
};











