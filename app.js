//Allows us to set request to only be allowed from our set origins.
const cors = require('cors');
const flash = require("express-flash")
//Express packages
const express = require('express');
const session = require('express-session');
const passport = require("passport");
var passportConfig = require('./auth/passport');


//Local Database for connection
const database = require('./models/index.js')

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

app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'test',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Applying Routes
app.use("/", require("./routes/login.routes"));


// Started Server
app.listen(PORT, console.log("Server started on port:  " + PORT));

