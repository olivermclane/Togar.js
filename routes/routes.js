
const express =  require('express');
const upload = require('../config/multer.config');

//Controller Methods
const { registerUserView,
        loginUserView,
        registerUser,
        loginUser
} = require("../controllers/login.controller.js");

const {togarView} = require("../controllers/togar.controller.js")

const { protectRoute } = require("../auth/protectRoutes");
const { togarUploadImageHandler} = require("../controllers/togar.controller");
const multerUpload = require('../config/multer.config');


const router = express.Router();
// "/" REDIRECT -- This will need work the protect route only redirects if the token is not valid.
router.get("/", protectRoute)


// LOGIN USER ROUTING
router.get("/login", loginUserView)
router.post("/login", loginUser)


// REGISTER USER ROUTING
router.get("/register", registerUserView)
router.post('/register', registerUser)

//TOGAR APPLICATION ROUTING
router.get("/togar", protectRoute, togarView )

router.post("/togar/upload", protectRoute, togarUploadImageHandler)

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

