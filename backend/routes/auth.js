const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'HiHelloMajama';

// ROUTE 1: Create a user using POST "/api/auth/createuser". No login required.
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid address').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 })

], async (req, res) => {

    // If there are errors then return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Chech whether the user with this email already exist
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exist" })
        }

        // Converting password into hash using bcrypt
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }

})



// ROUTE 2: Authenticate a user using POST "/api/auth/login". No login required.
router.post('/login', [
    // If email is not valid or password is left blank
    body('email', 'Enter a valid address').isEmail(),
    body('password', 'Password cannot be blank').exists()

], async (req, res) => {

    // If there are errors then return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });

        // If user with such email doesn't exist
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }

        // If email exist then compare password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }

        // If password matches then send token as response
        const data = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})



// ROUTE 3: Get loggedin user Details using POST "/api/auth/getuser". Login required.
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId.id).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})


module.exports = router;