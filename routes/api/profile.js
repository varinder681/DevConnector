const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const { body, validationResult} = require('express-validator');
const Users = require("../../models/Users");
const axios = require("axios");
const config = require('config');
const Post = require('../../models/Post')

    // @route Get api/profile/me
    // @desc Get current users profile
    // @access Private

router.get("/me" , auth, async (req, res)=>{
    try{
        const profile = await Profile.findOne({user : req.user.id}).populate('user',['name','avatar']);

        if(!profile){
            return res.status(400).json({ error : { msg : 'There is no profile for this user'} });
        }

        res.json(profile);

    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

router.post(
    '/',
    [
        auth,
        [
            body('status', 'Status is required').not().isEmpty(),
            body('skills', 'Skills is required').not().isEmpty()
        ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      // destructure the request
      const {
        company,
        location,
        bio,
        status,
        githubusername,
        website,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
      } = req.body;
  
      // Create profile

      const profileFields = {};
      profileFields.user = req.user.id;
      if(company) profileFields.company = company;
      if(website) profileFields.website = website;
      if(location) profileFields.location = location;
      if(bio) profileFields.bio = bio;
      if(status) profileFields.status = status;
      if(githubusername) profileFields.githubusername = githubusername;
      if(skills) {
          profileFields.skills = skills.split(',').map(skill => skill.trim());
      }
      
      // Build Social Object
      profileFields.social = {};
      if(youtube) profileFields.social.youtube = youtube;
      if(twitter) profileFields.social.twitter = twitter;
      if(linkedin) profileFields.social.linkedin = linkedin;
      if(instagram) profileFields.social.instagram = instagram;
      if(facebook) profileFields.social.facebook = facebook;


      try{

        let profile = await Profile.findOne({user : req.user.id});

        if(profile){
            // update profile
            profile = await Profile.findOneAndUpdate(
                {user : req.user.id},
                { $set : profileFields },
                { new : true }
            );

            return res.json(profile);
        }

        // Create 
        profile = new Profile(profileFields);
        await profile.save();

        return res.json(profile);

      }catch(err){
          console.log(err.message);
          res.status(500).send('Server error');
      }
    }



  );


//   @route /api/profile
//   @desc Get all profiles
//   @access Public


router.get('/', 
    async (req, res) => {
        try {
            const profiles = await Profile.find().populate('user', ['name','avatar']);
            res.json(profiles);
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    }
)

  //   @route /api/profile/user/:user_id
//   @desc Get Profile by user_id
//   @access Public


router.get('/user/:user_id', 
async (req, res) => {
    try {
        const profile = await Profile.findOne({ user : req.params.user_id }).populate('user', ['name','avatar']);
        
        if(!profile) return res.status(400).json({ error : { msg : 'Profile not found.'}});

        res.json(profile);
    } catch (err) {

        if(err.kind == 'ObjectId'){
            return res.status(400).json({ error : { msg : 'Profile not found.'}});
        }

        console.log(err.message);
        res.status(500).send('Server error');
    }
}
)

//   @route /api/profile
//   @desc Delete User, Profile, Posts
//   @access Private


router.delete('/', 
    auth,
    async (req, res) => {
        try {
            // delete user's posts
          await Post.deleteMany({ user : req.user.id})
            // delete user's profile

            await Profile.findOneAndDelete({user : req.user.id});

            // delete user

            await Users.findOneAndDelete({ _id : req.user.id });
            
            res.json({ msg : "Success!"});
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    }
)

//    @route /api/profile/experience
//    @desc To add experience to profile
//    @access Private

router.put('/experience',
    [
        auth,
        [
            body('title', 'Title is required').not().isEmpty(),
            body('company', 'Company is required').not().isEmpty(),
            body('from', 'From is required').not().isEmpty()
        ]
    ],
    async (req,res) => {

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }

        //     {
        //         title : { type : String,required : true},
        //         company : { type : String,required : true},
        //         location : {type : String},
        //         from : {type : Date,required : true},
        //         to : {type : Date},
        //         current : {type : Boolean,default : false},
        //         description : {type : String}
        //     }
        const {
            title,
            company,
            from,
            to,
            current,
            location,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            from,
            to,
            current,
            location,
            description
        }

        try {
            let profile = await Profile.findOne({ user : req.user.id});

            if(!profile){
                return res.status(400).json({ msg : 'Profile not found'});
            }

            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);
            
        } catch (err) {
            console.log(err.message);
            res.send('Server Error');
        }

        

    }
    
)

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
  
      foundProfile.experience = foundProfile.experience.filter(
        (exp) => exp._id.toString() !== req.params.exp_id
      );
  
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
    '/education',
    [
      auth,
      [
        body('school', 'School is required').not().isEmpty(),
        body('degree', 'Degree is required').not().isEmpty(),
        body('fieldofstudy', 'Field of study is required').not().isEmpty(),
        body('from', 'From date is required and needs to be from the past')
          .not()
          .isEmpty()
          .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;
      
      let newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };

  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.education.unshift(newEdu);
        
        console.log(profile);
        
        await profile.save();
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );
  
  // @route    DELETE api/profile/education/:edu_id
  // @desc     Delete education from profile
  // @access   Private
  
  router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
      foundProfile.education = foundProfile.education.filter(
        (edu) => edu._id.toString() !== req.params.edu_id
      );
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', async (req, res) => {
    try {
      const uri = encodeURI(
        `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
      );
      const headers = {
        'user-agent': 'node.js',
        Authorization: `token ${config.get('githubToken')}`
      };
  
      const gitHubResponse = await axios.get(uri,  headers );


      return res.json(gitHubResponse.data);
    } catch (err) {
      console.error(err.message);
      return res.status(404).json({ msg: 'No Github profile found' });
    }
});


module.exports = router;