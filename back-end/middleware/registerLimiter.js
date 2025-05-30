const rateLimit = require("express-rate-limit");

const registerLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3,
    message: {
        error: "Too many registration attempts. Please try again later.",
    },
});

module.exports = {
    registerLimiter,
};