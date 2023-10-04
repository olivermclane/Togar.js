
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
router.get("/togar", protectRoute, togarView)

router.post("/togar/upload", togarUploadImage)

//LOGOUT ROUTING
router.get('/logout', function(req, res, next){
        req.logout(function(err) {
                if (err) { return next(err); }
                res.redirect('/login');
        });
});

module.exports = router;

