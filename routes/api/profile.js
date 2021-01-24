const express = require("express");
const router = express.Router();
const auth = require("./../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

const { check, validationResult } = require("express-validator");
const { response } = require("express");

// @route    GET api/profile/me
// @desc     Get current user profile
// @access   Private
router.get("/me", auth, async(req, res) => 
{
    // Fetch my profile.
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar"]);
        
        if(!profile)
        {
            return res.status(400).json({ msg: "There is no profile for this user." });
        }

        return res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server error.");
    }
});

// @route    POST api/profile
// @desc     Create or Update a user profile
// @access   Private
router.post("/", [auth, [
    check("status", "Status is required").not().isEmpty(),
    check("skills", "Skills field is required").not().isEmpty(),
]], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    // Fetch data from form body
    const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = req.body;

    // Build Profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(bio) profileFields.bio = bio;
    if(githubusername) profileFields.githubusername = githubusername;
    if(location) profileFields.location = location;
    if(status) profileFields.status = status;
    
    // Build Skills Array
    if(skills){
        profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    // Build Social Object
    profileFields.social = {};
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(youtube) profileFields.social.youtube = youtube;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if(profile)
        {
            // Update the profile
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
            return res.json(profile);
        }
        
        // Create
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error");
    }
});

// @route    GET api/profile
// @desc     GET all profiles
// @access   Public
router.get("/", async(req, res) => {
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"]);
        return res.json(profiles);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server error.");
    }
});

// @route    GET api/profile/user/user_id
// @desc     GET a user profile by UserId
// @access   Public
router.get("/user/:user_id", async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate("user", ["name", "avatar"]);
        if(!profile)
        {
            return res.status(400).json({ msg: "Profile not found." });
        }
        return res.json(profile);
    } catch (error) {
        console.log(error.message);

        // If put invalid objectId it will throw an error
        if(error.kind == "ObjectId")
        {
            return res.status(400).json({ msg: "Profile not found." });
        }
        return res.status(500).send("Server error.");
    }
});

module.exports = router;