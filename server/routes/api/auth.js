const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator'); // check is a function that takes in the request and the response
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// @route   GET api/auth
// @desc    Tests profile route
// @access  Public
router.get('/', auth, async (req, res) => {
    //console.log(req.user);
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/auth
// @desc    Tests auth route
// @access  Public
router.post('/', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').exists()
    
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { 
            return res.status(400).json({ errors: errors.array() });
        }
        const {email, password } = req.body;
        try { 
            // See if user exists
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }
            // Match password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }
         
            // return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload, process.env.JWT_SECRET , { expiresIn: 3600000 }, (err, token) => { 
                if (err) throw err;
                res.json({ token });
            } );

        }
        catch(err) { 
            console.error(err.message);
            res.status(500).send('Server Error');
        }


    
});


module.exports = router;
