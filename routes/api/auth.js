const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

router.get("/" , auth, async (req, res)=>{

    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.log(err.message);
        return res.status(500).json({ msg : 'Server Error'});
    }

})

// Authenticate user and get Token

router.post(
    "/", 
    [
        body('email','Enter a valid Email').isEmail(),
        body('password','Password is Required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors);
            return res.status(400).json({ errors : errors.array()});     
        }
    
        const {email, password} =  req.body;
        
        try{
            //See if user exists
            let user = await User.findOne({email});
    
            if(!user){
                return res.status(400).json({ errors : [ {msg : 'user not registered'} ]});
            }
            
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);

            if(!isPasswordCorrect){
                return res.status(401).json({errors : [ {msg : 'Wrong Password'} ]});
            }
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
            console.log(err.message);
            res.status(500).send('Server Error');
        }
      
    })
module.exports = router;