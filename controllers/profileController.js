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
 
const updateWithoutPassword = async(req, res, next) => {
    try {
        const userId = req.userId
        if(!userId) throw new Error("Can't get user profile");
        const userProfile = await Profile.findOne({userId})
        const user = await User.findById(userId)
        if(!req.body.username && !req.body.fullName && !req.body.email && !req.body.photo){
            return res.status(400).json({message: 'Nothing to be changed'})  
        } 
        if(!userProfile) return res.status(404).json({message: "user profile not found"});
        if(req.body.username){
            userProfile.username = req.body.username;
            user.name = req.body.username
        }

        if(req.body.fullName){
            userProfile.fullName = req.body.fullName;
        }
        
        if(req.body.photo){
            userProfile.photo = req.body.photo;
        }
        if(req.body.email){
            userProfile.email = req.body.email;
            user.email = req.body.email;
            const token = jwt.sign({id: user._id, email: req.body.email}, process.env.JWT_SECERET)
            user.tokens = user.tokens.concat(token);
            if(user.role==='super'){
                res.cookie('adminToken', token, {httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'None'})
            }else{
                res.cookie('accessToken', token, {httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'None'})
            }
        }
        const updatedProfile = await userProfile.save({versionKey: 'version'});
        const updatedUser = await user.save({versionKey: 'version'});
        res.status(200).json({profile: updatedProfile});
    } catch (error) {
        console.error(error);
        res.status(400).json({message: error.message});
    }
}


module.exports = { getUserProfile, updateWithoutPassword }