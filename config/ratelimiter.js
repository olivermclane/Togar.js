const ratelimit = require('express-rate-limit');

//Setting up a basic rate limiter to prevent excess requests
const limiter = ratelimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
    message: {
        status: 429,
        limiter: true,
        message: 'User limit have exceeded the 100 requests in 24hrs',
    },
    standardHeaders: true,
    legacyHeaders: false,
});


module.exports = limiter;