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
/**
 * @api {get} /register Loads user creation page
 * @apiName LoadUserPage
 * @apiGroup User
 */
const registerUserView = (req, res) => {
    const errors = {}; // Flash messages containing errors set using express-flash
    res.render("register", { errors });
};

/**
 * @api {post} /register Request for user creation
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} username The username of the user you intend to create.
 *
 * @apiSuccessExample {html} Success-Response:
 *     HTTP/1.1 201 Created
 *     Location: /login
 *
 * @apiErrorExample {html} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Invalid username format."
 *     }
 *     HTTP/1.1 501 Entry Exist
 *     {
 *       "error": "Registration Error: Username is taken"
 *     }
 */
const registerUser = (req, res) => {
    const { username } = req.body;
    const errors = [];

    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
    if (!username || !username.match(usernameRegex)) {
        errors.push("Invalid username format.");
    }

    // Check if the username already exists in the database
    findUserByUsername(username).then((user) => {
        if (user) {
            // If user already exists, send an error response
            errors.push("Registration Error: Username is taken");
            logger.warn(`User creation failed: Account already exists with username: ${username}`);
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
                    res.status(500).send("Internal Server Error - Contact Admin");
                });
        }
    });
};

/**
 * @api {get} /login Loads user login page
 * @apiName LoadLoginPage
 * @apiGroup User
 *
 */
const loginUserView = (req, res) => {
    const errors = [];
    res.render("login", {errors});
};

/**
 * @api {post} /login Request for user login
 * @apiName LoginUser
 * @apiGroup User
 *
 * @apiParam {String} username The username of the user you intend to log in.
 *
 * @apiSuccessExample {html} Success-Response:
 *     HTTP/1.1 302 Found
 *     Location: /togar
 *
 * @apiErrorExample {html} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "errors": [
 *         "Please provide a valid username."
 *       ]
 *     }
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Internal Server Error"
 *     }
 */
const loginUser = (req, res, next) => {
    const { username } = req.body;
    const errors = [];
    //Confirming the entered username matches our schema
    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;

    if (!username || !username.match(usernameRegex)) {
        errors.push("Please provide a valid username.");
    }

    if (errors.length > 0) {
        // Log validation errors using Pino
        errors.forEach(error => {
            logger.error(`User login validation error: ${error}`);
        });

        // Send error response with validation errors in the 'errors' field
        res.status(400).render("/login{", {errors} );
    } else {
        // If username is provided, authenticate the user using Passport.js local strategy
        passport.authenticate("local", (err, user) => {
            if (err) {
                // Log errors using Pino
                logger.error(`User login failed due to database error: ${err.message}`);
                return res.status(500).render("login", {errors});
            }
            if (!user) {
                // Log invalid username using Pino
                logger.error(`User login failed: Invalid username - ${username}`);
                errors.push("Please provide a valid username.")
                // Send error response indicating invalid username
                return res.status(400).render("login", {errors});
            }

            // Log successful login using Pino
            logger.info(`User login successful: username - ${username}`);
            // Redirect to '/togar' on successful login
            return res.redirect("/togar");
        })(req, res, next);
    }
};

// Export functions for use in other parts of the application
module.exports = {
    registerUserView,
    registerUser,
    loginUserView,
    loginUser
};