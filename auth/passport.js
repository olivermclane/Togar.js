// Import necessary modules and dependencies
const LocalStrategy = require("passport-local").Strategy;
const database = require('../models/');
const User = database.users;
const where = database.Sequelize.where;
const Op = database.Sequelize.Op;
var passport = require('passport');

// Configure Passport to use a local strategy for authentication
passport.use('local', new LocalStrategy({usernameField:'username',passwordField:'username'}
    ,function (req , username, done) {
        // Find a user in the database based on the provided username
        User.findOne({where:
                {username: username }})
            .then(function (user) { // Handle successful query to the database
                // If no user is found, indicate invalid username
                if (user == null) {
                    done(null, false);
                } else { // Pass the user object if found
                    done(null, user);
                }
            })
            .catch(function (err) { // Handle errors that occur during the database query
                done(err);
            });
    }));

// Serialize user data to store in the session (stores user id)
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// Deserialize user data from the session (retrieves user information from user id)
passport.deserializeUser(function (userId, done) {
    // Find user in the database based on the stored user id
    User
        .findOne({where: {id: userId}})
        .then(function (user) { // Handle successful query and return user data
            done(null, user);
        }).catch(function (err) { // Handle errors that occur during the database query
        done(err, null);
    });
});
