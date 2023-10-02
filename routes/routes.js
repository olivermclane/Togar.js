
const express =  require('express');

//Controller Methods
const { registerUserView,
        loginUserView,
        registerUser,
        loginUser
} = require("../controllers/login.controller.js");

const {
        togarView
} = require("../controllers/togar.controller.js")

const { protectRoute } = require("../auth/protectRoutes");
const {togarUploadImage} = require("../controllers/togar.controller");


const router = express.Router();

// LOGIN USER ROUTING
router.get("/login", loginUserView)
router.post("/login", loginUser)


// REGISTER USER ROUTING
router.get("/register", registerUserView)
router.post('/register', registerUser)

//TOGAR APPLICATION ROUTING
router.get("/togar", togarView, protectRoute)

router.post("/togar/upload", togarUploadImage)

module.exports = router;
