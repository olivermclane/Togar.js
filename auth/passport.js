const LocalStrategy = require("passport-local").Strategy;
const database = require('../models/');
const User = database.users;
const passport = require('passport');
const logger = require("../config/logger");
const flash = require('express-flash');


passport.use('local', new LocalStrategy({ usernameField: 'username', passwordField: 'username' },
    function (username, password, done) {
        // Find a user in the database based on the provided username
        User.findOne({ where: { username: username } })
            .then(function (user) {
                // If no user is found, indicate invalid username
                if (user == null || !user) {
                    logger.warn(`User login failed: Invalid username - ${username}`);
                    return done(null, false);
                }

                // Handle successful login
                logger.info(`User login successful: username - ${username}`);
                return done(null, user);
            })
            .catch(function (err) {
                // Handle errors that occur during the database query
                logger.error(`User login failed due to database error: ${err.message}`);
                return done(err, false);
            });
    }));

// Serialize user data to store in the session (stores user id)
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// Deserialize user data from the session (retrieves user information from user id)
passport.deserializeUser(function (userId, done) {
    // Find user in the database based on the stored user id
    User.findOne({ where: { id: userId } })
        .then(function (user) {
            // Handle successful query and return user data
            done(null, user);
        })
        .catch(function (err) {
            // Handle errors that occur during the database query
            done(err, null);
        });
});
