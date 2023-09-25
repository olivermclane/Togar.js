
//Protecting route from forgery
const protectRoute = (req, res, next) =>{
    if (req.isAuthenticated()) {
        return next();
    }
    console.log('Please log in to continue');
    res.redirect('/login');
}

//redirect if user is authenticated
const allowRoute = (req, res, next) =>{
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/togar');
}


module.exports = {
    protectRoute,
    allowRoute,
};