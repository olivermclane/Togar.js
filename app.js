//Allows us to set request to only be allowed from our set origins.
const cors = require('cors');
const flash = require("express-flash"); // Allows flashing on requests in express
const logger = require("./config/logger")

const path = require('path');

//cookie parser
const cookieParser = require("cookie-parser");


// Rate limiter for requests
const ratelimiter = require('./config/ratelimiter.js')

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

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(
    // Sessions info
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: true,
        resave: true,
        cookie: { maxAge: 60000 },
    }),
    // Applying Passport
    passport.initialize(),
    passport.session(),
    flash()
);
app.use(ratelimiter);
app.use("/", require("./routes/routes"));
app.use('/uploads', express.static('uploads'));
// Applying Routes
module.exports = app;

// Started Server
if (require.main === module) {
    // This block will be executed only if this file is run directly, (node app)
    // not when it's imported as a module in another file.
    app.listen(PORT, () => {
        logger.info("Server started on port:  " + PORT);
    });
}
