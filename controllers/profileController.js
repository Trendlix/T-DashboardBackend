const Profile = require('../models/profileModel')
const jwt = require('jsonwebtoken')
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

        const updatedProfile = await userProfile.save();
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error(error);
        res.status(400).json({message: error.message});
    }
}


module.exports = { getUserProfile, updateUserProfile }