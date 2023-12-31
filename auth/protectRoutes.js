const logger = require('../config/logger');
// Middleware function to protect routes from unauthorized access.
const protectRoute = (req, res, next) => {
    // Check if the user is authenticated.
    if (req.isAuthenticated()) {
        // If authenticated, allow the request to proceed to the next middleware or route handler.
        return next();
    }
    // If not authenticated, log a message and redirect the user to the login page.
    logger.info('User access without token', req);
    res.redirect('/login');
};

// Middleware function to redirect authenticated users away from certain routes.
const allowRoute = (req, res, next) => {
    // Check if the user is not authenticated.
    if (!req.isAuthenticated()) {
        // If not authenticated, allow the request to proceed to the next middleware or route handler
        return next();
    }
    // If authenticated, redirect the user to a specified page, in this case, '/togar'.
    logger.info('User retain previous access using token', req);
    res.redirect('/togar');
};

// Export the middleware functions for use in other parts of the application.
module.exports = {
    protectRoute,
    allowRoute,
};
