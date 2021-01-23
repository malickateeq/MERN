const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route    POST api/users
// @desc     Register User
// @access   Public
router.post("/", [

    // Validation rules here..
    // check("filedName", "Error message").ruleA().ruleB();
    check("name", "Name is required.").not().isEmpty(),
    
    check("email", "Please enter a valid email address.").isEmail(),
    
    check("password", "Please enter a password with 6 or more characters.").isLength({ min: 6 })
    
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
    const { name, email, password } = req.body;

    try {
        // 1. See if user already exists
        let user = await User.findOne({ email: email });

        if(user) {
            // Return the same error in format as default one
            return res.status(400).json({ errors: [{ msg: "User already exists" }] });
        }

        // 2. Get Users Gravator
        const avatar = gravatar.url(email, {
            s: "200",
            r: "pg",
            d: "mm"
        });

        user = new User({
            name,
            email,
            password,
            avatar
        });

        // 3. Encrypt password
        // Use salt the more the secure
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
    
        // 4. Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        };

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