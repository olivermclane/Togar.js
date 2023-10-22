// Import necessary modules
const database = require('../models/');
const passport = require("passport");
const fs = require('fs'); // Node.js file system module for file operations
const path = require('path'); // Node.js path module for working with file paths

// Access the User model from the database
const User = database.users;

// Function to create a directory for user uploads
const createUserDirectory = (userId) => {
    // Define the path for user uploads directory based on user ID
    const userUploadsPath = path.join(__dirname, `../uploads/${userId}`);

    // Check if the directory already exists, create it if not
    if (!fs.existsSync(userUploadsPath)) {
        fs.mkdirSync(userUploadsPath, { recursive: true });
    }
};

// Async function to find a user by username in the database
async function findUserByUsername(username) {
    try {
        // Query the database to find users matching the provided username
        const users = await User.findAll({ where: {username: username} });
        // Return the first user found (if any)
        return (users instanceof Array) ? users[0] : null;
    } catch (ex) {
        // Handle exceptions if the database query fails
        throw ex;
    }
}

// Render the register view for user registration
const registerUserView = (req, res) => {
    res.render("register", {});
};

// Handle user registration logic
const registerUser = (req, res) => {
    const { username } = req.body;
    if (!username) {
        // If username is not provided, send an error response
        res.status(409).send("Fields Left Blank");
        console.log("Registration Fields Left Empty");
    } else {
        // Check if the username already exists in the database
        findUserByUsername(username).then((user) => {
            if (user) {
                // If user already exists, send an error response
                res.status(409).send("User Creation Failed: Username Already Exists");
                console.log("Account already exists with:" + username);
            } else {
                // If username is unique, create a new user in the database
                const newUser = {
                    username: username,
                };
                User.create(newUser)
                    .then((createdUser) => {
                        // Create a directory for the new user's uploads
                        createUserDirectory(createdUser.id);
                        // Redirect to the login page after successful registration
                        res.status(201).redirect("/login");
                    })
                    .catch((err) => {
                        // Handle database errors if user creation fails
                        console.log(err);
                        res.status(500).send("Internal Server Error");
                    });
            }
        });
    }
};

// Render the login view for user login
const loginUserView = (req ,res) => {
    res.render("login", {});
};

// Handle user login logic
const loginUser = (req, res, next) => {
    const {username} = req.body;
    if (!username) {
        // If username is not provided, render the login view with an error message
        console.log("Please provide all the valid fields: (username)");
        res.render("login", {
            username,
        });
    } else {
        // If username is provided, authenticate the user using Passport.js local strategy
        console.log("Authentication started");
        passport.authenticate("local", {
            // Redirect to '/togar' on successful login, otherwise redirect to '/login'
            successRedirect: "/togar",
            failureRedirect: "/login",
            // Enable flash messages for authentication failures
            failureFlash: true
        })(req,res,next);
    }
};

// Export functions for use in other parts of the application
module.exports = {
    registerUserView,
    registerUser,
    loginUserView,
    loginUser
};