const express = require("express");
const router = express.Router();
const auth = require("./../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

// @route    GET api/auth
// @desc     Test route
// @access   Public
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server error");
    }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post("/", [
    check("email", "Please enter a valid email address.").isEmail(),
    check("password", "Password is required.").exists()
],
async (req, res) => {

    // Perform Validation
    const errors = validationResult(req);

    // If there're errors then
    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() })
    }

    // Register User
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email });

        if(!user) {
            return res.status(400).json({ errors: [{ msg: "Invalid credentials." }] });
        }
    
        const payload = {
            user: {
                id: user.id
            }
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
        {
            return res.status(400).json({ errors: [{ msg: "Invalid credentials." }] });
        }

        jwt.sign(
            payload, 
            config.get("jwtSecret"),
            { expiresIn: 36000 },
            (err, token) => {
                if(err) throw err;
                return res.json({
                    token
                });
        });

    } catch (err) {
        // Server error
        console.error(err.message);
        return res.status(500).send("Server error");
    }

});

module.exports = router;