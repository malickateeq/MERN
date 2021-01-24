const jwt = require("jsonwebtoken");
const config = require("config");


module.exports = function (req, res, next)
{
    // 1. Get the token from the header
    const token = req.header("x-auth-token");

    // Check if no token
    if(!token){
        return res.status(401).json({ msg: "Authorization failed, Invalid token." });
    }

    // 2. Verify the token
    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"));

        req.user = decoded.user;

        // TODO: Add endpoint validation - or token chaining

        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid." });
    }
}