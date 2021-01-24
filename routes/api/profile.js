const express = require("express");
const router = express.Router();
const auth = require("./../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const request = require("request");
const config = require("config");

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

// @route    DELETE api/profile
// @desc     DELETE Profile, user and posts
// @access   Private
router.delete("/", auth, async(req, res) => {
    try {
        // TODO - remove users posts
        // Remove Profile
        await Profile.findOneAndRemove({ user: req.user.id });

        // Remove User
        await User.findOneAndRemove({ _id: req.user.id });

        return res.json({ msg: "User deleted." });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server error.");
    }
});

// @route    PUT api/profile/experience
// @desc     Add experiences in Profile
// @access   Private
router.put("/experience", [auth, [
    check("title", "Title is required.").not().isEmpty(),
    check("company", "Company is required.").not().isEmpty(),
    check("from", "From date is required.").not().isEmpty(),
]], async(req, res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } = req.body;

    const newExp = { title, company, location, from, to, current, description };

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        // push insert in the end
        // unshift insert in the beginning
        profile.experience.unshift(newExp);
        await profile.save();
        return res.json(profile);

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error");
    }

});

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile->experience
// @access   Private
router.delete("/experience/:exp_id", auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get the correnct experience to remove
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);
        await profile.save();

        return res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error");
    }
});


// @route    PUT api/profile/education
// @desc     Add educations in Profile
// @access   Private
router.put("/education", [auth, [
    check("school", "School is required.").not().isEmpty(),
    check("degree", "Degree is required.").not().isEmpty(),
    check("fieldOfStudy", "Field of Study is required.").not().isEmpty(),
    check("from", "From date is required.").not().isEmpty(),
]], async(req, res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldOfStudy, from, to } = req.body;

    const newEdu = { school, degree, fieldOfStudy, from, to };

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        // push insert in the end
        // unshift insert in the beginning
        profile.education.unshift(newEdu);
        await profile.save();
        return res.json(profile);

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error");
    }

});

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile->education
// @access   Private
router.delete("/education/:edu_id", auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get the correnct education to remove
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);
        await profile.save();

        return res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error");
    }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from github
// @access   Public
router.get("/github/:username", async(req, res) => {
    try {
        const options = {
            uri: `https:api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubClientSecret')}`,
            method: "GET",
            headers: { "user-agent": "node.js" }
        };
        request(options, (error, response, body) => {
            if(error) console.log(error);

            if(response.statusCode !== 200)
            {
                return res.status(404).json("No Github profile found.");
            }

            return res.json(JSON.parse(body));
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error");
    }
});

module.exports = router;