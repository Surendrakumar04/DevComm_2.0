const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); // check is a function that takes in the request and the response
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required min of 6').isLength({ min: 6 }),
    
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { 
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        try { 
            // See if user exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            // get gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            }, true);

            // Create new user
            user = new User({
                name,
                email,
                avatar,
                password
            });

            // encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            // save user
            await user.save();
            //res.send('User Registration Successful');

            // return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 3600000 }, (err, token) => { 
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
