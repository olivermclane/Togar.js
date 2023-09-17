module.exports = app => {
    const users = require("../controllers/loginController.js");
    var router = require('express').Router();
    router.post("/login", users.login)

    app.use("/user", router)
}

