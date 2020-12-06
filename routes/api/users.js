const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/Users');

// @route POST api/users  --> For registering new users

router.post(
"/", 
[
    body('name', '* Name is required').not().isEmpty(),
    body('email','Enter a valid Email').isEmail(),
    body('password','Enter a password with min-length 5').isLength({min : 5 })
],
async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(400).json({ errors : errors.array()});     
    }

    const {name, email, password} =  req.body;
    
    try{
        //See if user exists
        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({ errors : [ {msg : 'user already exists'} ]});
        }

        // Get users gravatar
        const avatar = gravatar.url(email,{
            s : '200',
            r : 'pg',
            d : 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        // Encrypt password
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        // Return jsonwebtoken

        const payload = {
            user : {
                id : user.id
            }
        }
        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            {expiresIn : 36000},
            (err, token) => {
                if(err) throw err;
                res.json({token});
            }
        );


    } catch(err){
        // console.log(err.message);
        res.status(500).json( { errors : [{ msg : "Server Error"}] });
    }

    
})


module.exports = router;