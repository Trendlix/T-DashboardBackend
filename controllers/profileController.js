const Profile = require('../models/profileModel')

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config() 
}

const getUserProfile = async(req, res, next) => {
    try {
        const id = req.params.id;
        if(!id) throw new Error("Can't get user profile");
        const userProfile = await Profile.findById(id);
        if(!userProfile) throw new Error("User profile not found please register first");
        res.status(200).json(userProfile);
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message});   
    }
}
 
const updateUserProfile = async(req, res, next) => {
    try {
        const id = req.params.id;
        // console.log('req.body', req.body);
        if(!id) throw new Error("Can't get user profile");
        const userProfile = await Profile.findById(id);
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

const deleteUserProfile = async(req, res, next) => {
    try {
        const id = req.params.id;
        if(!id) throw new Error("Can't get user profile");
        await Profile.findByIdAndDelete(id).then(()=>{
            res.status(200).json({message: "User profile deleted successfully"})
        }).catch(err => console.log(err));        
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message});  
    }
}


module.exports = { getUserProfile, deleteUserProfile, updateUserProfile }