const jwt = require("jsonwebtoken");

const JWT_SECRET = "lfnljkasdnfscfsgm";

module.exports.createSecretToken = (id) => {
    return jwt.sign({id}, JWT_SECRET, {
        expiresIn: 3 * 24 * 60 * 60,
    });
};