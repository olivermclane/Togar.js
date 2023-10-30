// Import necessary modules
const database = require('../models/');
const passport = require("passport");
const fs = require('fs'); // Node.js file system module for file operations
const path = require('path'); // Node.js path module for working with file paths
const flash = require('express-flash');

const logger = require("../config/logger");

// Access the User model from the database
const User = database.users;

// Function to create a directory for user uploads
const createUserDirectory = (userId) => {
    // Define the path for user uploads directory based on user ID
    const userUploadsPath =  path.join(process.env.IMAGE_DIRECTORY, String(userId));

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
    const errors = {}; // Flash messages containing errors set using express-flash
    res.render("register", { errors });
};

// Handle user registration logic
const registerUser = (req, res) => {
    const { username } = req.body;
    const errors = [];

    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
    if (!username || !username.match(usernameRegex)) {
        errors.push("Username must be 3 to 16 characters long and can only contain letters, numbers, underscores, and hyphens.");
    }

    // Check if the username already exists in the database
    findUserByUsername(username).then((user) => {
        if (user) {
            // If user already exists, send an error response
            errors.push("Registration Error: Username is taken");
            logger.error(`User creation failed: Account already exists with username: ${username}`);
            res.status(501).render("register", { errors });
        } else if (errors.length > 0) {
            // If there are validation errors, send an error response with validation messages
            res.status(400).render("register", { errors });
            logger.error(`User creation failed due to validation errors: ${errors.join(', ')}`);
        } else {
            // If username is unique and valid, create a new user in the database
            const newUser = {
                username: username,
            };
            User.create(newUser)
                .then((createdUser) => {
                    // Create a directory for the new user's uploads
                    createUserDirectory(createdUser.id);
                    // Redirect to the login page after successful registration
                    res.status(201).redirect("/login");
                    logger.info(`User created successfully: username - ${username}`);
                })
                .catch((err) => {
                    // Handle database errors if user creation fails
                    logger.error(`User creation failed due to database error: ${err.message}`);
                    res.status(500).send("Internal Server Error");
                });
        }
    });
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