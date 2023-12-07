
const express =  require('express');

//Controller Methods
const { registerUserView,
        loginUserView,
        registerUser,
        loginUser
} = require("../controllers/login.controller.js");

const {togarView} = require("../controllers/togar.controller.js")

const { protectRoute, allowRoute} = require("../auth/protectRoutes");
const { togarUploadImageHandler} = require("../controllers/togar.controller");


const router = express.Router();
// "/" REDIRECT
router.get("/", protectRoute, allowRoute)


// LOGIN USER ROUTING
router.get("/login", allowRoute, loginUserView)
router.post("/login", loginUser)


// REGISTER USER ROUTING
router.get("/register", registerUserView)
router.post('/register', registerUser)

//TOGAR APPLICATION ROUTING
router.get("/togar", protectRoute, togarView )
router.post("/togar/upload", togarUploadImageHandler)

//LOGOUT ROUTING
router.get('/logout', function(req, res, next){
        req.logout(function(err) {
                if (err) {
                        return next(err);
                }
                res.redirect('/login');
        });
});

module.exports = router;

