const database = require('../models/');
const passport = require("passport");
const fs = require('fs');
const path = require('path');

const User = database.users;
const Op = database.Sequelize.Op;
const where = database.Sequelize.where;


const createUserDirectory = (userId) => {
    const userUploadsPath = path.join(__dirname, `../uploads/${userId}`);

    // Check if the directory already exists
    if (!fs.existsSync(userUploadsPath)) {
        // If not, create the directory
        fs.mkdirSync(userUploadsPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating user directory:', err);
            } else {
                console.log('User directory created successfully');
            }
        });
    }
};
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
    if (!username) {
        res.status(409).send("Fields Left Blank");
        console.log("Registration Fields Left Empty");
    } else {
        findUserByUsername(username).then((user) => {
            if (user) {
                res.status(409).send("User Creation Failed: Username Already Exists");
                console.log("Account already exists with:" + username);
            } else {
                const newUser = {
                    username: username,
                };
                User.create(newUser)
                    .then((createdUser) => {
                        // Create a directory for the new user
                        createUserDirectory(createdUser.id);
                        res.status(201).redirect("/login");
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).send("Internal Server Error");
                    });
            }
        });
    }
};

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











