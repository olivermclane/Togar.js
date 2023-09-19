//Allows us to set request to only be allowed from our set origins.
const cors = require('cors');

const express = require('express');
const database = require('./models')
const app = express();
const PORT = process.env.PORT || 3000;

//Allows origin of request to come from any origin (*)
var corsOptions = {
    origin: '*'
};

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

app.use(cors(corsOptions));

const loginController = require('./controllers/login.controller');

// parse requests of content-type - application/json
app.use(express.json());

database.connection.sync();

app.get('/', (req, res) => {
    res.json({message: 'Welcome to Togar'});
});
app.get("/user/login", (req, res) => {
    res.render("login");
});
app.get("/user/register", (req, res) => {
    res.render("register");
});
app.post("/api/login", (req, res) => {
    if(loginController.createNewUser(req.body.username)) {
        res.send("Welcome: " + req.body.username)
    }
    res.send("Login failed")
});


app.get("/user/togar", (req , res) => {
    res.render("togar");
});
app.post("/user/login", (req, res) => {
    if(loginController.createNewUser(req.body.username)){
        console.log("here?")
        res.redirect("togar");
    }
    res.status(500).send({
        message: "Some error occurred while signing you up."
    });
});


app.post


require("./routes/login.routes")(app);



app.listen(PORT, console.log("Server started on port:  " + PORT));

