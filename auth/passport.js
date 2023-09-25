const LocalStrategy = require("passport-local").Strategy;
const database = require('../models/');
const User = database.users;
const where = database.Sequelize.where;
const Op = database.Sequelize.Op;
var passport = require('passport');

passport.use('local', new LocalStrategy({usernameField:'username',passwordField:'username'}
,function (req , username, done) {
    console.log("starting")
    User.findOne({where: {username: username }})
        .then(function (user) { // successful query to database
            console.log(user)
            if (user == null) {
                console.log("Invalid Username");
                done(null, false);
            } else {
                console.log("Passing user");
                done(null, user);
            }
        })
        .catch(function (err) { // something went wrong with query to db
            done(err);
        });
}));

// serialize session, only store user id in the session information
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// from the user id, figure out who the user is...
passport.deserializeUser(function (userId, done) {
    User
        .findOne({where: {id: userId}})
        .then(function (user) {
            done(null, user);
        }).catch(function (err) {
        done(err, null);
    });
});


