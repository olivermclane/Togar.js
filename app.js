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

app.use(cors(corsOptions));


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

database.connection.sync();

app.get('/', (req, res) => {
    res.json({message: 'Welcome to Togar'})
});

require("./routes/login.routes")(app);



app.listen(PORT, console.log("Server started on port:  " + PORT))

