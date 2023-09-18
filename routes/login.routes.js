module.exports = app => {
    const users = require("../controllers/login.controller.js");
    var router = require('express').Router();
    router.post("/login", users.login)

    app.use("/user", router)
}

