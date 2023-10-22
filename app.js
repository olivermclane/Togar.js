//Allows us to set request to only be allowed from our set origins.
const cors = require('cors');
const flash = require("express-flash");


const path = require('path');

//Express packages
const express = require('express');
const session = require('express-session');
const passport = require("passport");
var passportConfig = require('./auth/passport');

//dotenv for enviorment variables
require('dotenv').config();


//Local Database for connection
const database = require('./models/index.js');

const app = express();
const PORT = process.env.PORT || 3000;

//Allows origin of request to come from any origin (*)
var corsOptions = {
    origin: '*'
};

app.set("view engine", "ejs");

app.use(cors(corsOptions));

database.connection.sync();
app.use(express.json());

// Serve CSS files from the 'views/static/css' directory
app.use('/static/css', express.static(path.join(__dirname, 'views/static/css')));

// Serve JavaScript files from the 'views/static/scripts' directory
app.use('/static/scripts', (req, res, next) => {
    res.setHeader('Content-Type', 'application/javascript');
    next();
}, express.static(path.join(__dirname, 'views/static/scripts')));

app.use(express.urlencoded({extended: true}));
app.use(
    // Sessions info
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: true,
        resave: true
    }),
    // Applying Passport
    passport.initialize(),
    passport.session(),
    flash()
);


app.use('/uploads', express.static('uploads'));

// Applying Routes
app.use("/", require("./routes/routes"));


// Started Server
app.listen(PORT, console.log("Server started on port:  " + PORT));

