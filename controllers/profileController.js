const Profile = require('../models/profileModel')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs/dist/bcrypt')

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config() 
}

const getUserProfile = async(req, res, next) => {
    try {
        const userId = req.userId
        if(!userId) return res.status(404).json({message: "Can't get user profile"});
        const userProfile = await Profile.findOne({userId});
        if(!userProfile) return res.status(404).json({message: "User profile not found please register first"});
        res.status(200).json(userProfile);
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message});   
    }
}
 
const updateUserProfile = async(req, res, next) => {
    try {
        const userId = req.userId
        if(!userId) throw new Error("Can't get user profile");
        const userProfile = await Profile.findOne({userId})
        const user = await User.findById(userId)
        if(!req.body.username && !req.body.password && !req.body.fullName && !req.body.email && !req.body.photo) return res.status(400).json({message: 'Nothing to be changed'})
        if(!userProfile) throw new Error("user profile not found");

        if(req.body.username){
            userProfile.username = req.body.username;
        }

        if(req.body.fullName){
            userProfile.fullName = req.body.fullName;
        }
        
        if(req.body.photo){
            userProfile.photo = req.body.photo;
        }
        if(req.body.email){
            userProfile.email = req.body.email;
        }
        if(req.body.currentPassword && req.body.newPassword && req.body.confirmPassword){
            if(req.body.newPassword === req.body.confirmPassword){
                const isCorrect = bcrypt.compareSync(req.body.currentPassword, user.password);
                if(!isCorrect) return res.status(400).json({message: 'Invalid password'})
                user.password = req.body.newPassword
            }else{
                throw new Error('Passwords do not match')
            }
        }
        const updatedProfile = await userProfile.save();
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error(error);
        res.status(400).json({message: error.message});
    }
}


module.exports = { getUserProfile, updateUserProfile }