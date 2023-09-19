module.exports = app => {
    const users = require("../controllers/login.controller.js");
    const router = require('express').Router();
    router.post("/login")

    app.use("/user", router)
}

