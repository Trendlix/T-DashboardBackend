const User = require('../models/userModel')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Profile = require('../models/profileModel')
require('dotenv').config() 
// Login
const login = async function (req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({message: "This email is not found !"});

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) return res.status(400).json({message: "Wrong password or email!"});

    console.log('JWT_SECERET', process.env.JWT_SECERET)
    const token = jwt.sign( { id: user._id, email: user.email }, process.env.JWT_SECERET );
    user.tokens=user.tokens.concat(token);
    user.save(); 
    const { password, ...info } = user._doc;
    if(info.role === 'super'){
      res.cookie("adminToken", token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None': 'lax',
        maxAge: 3600000,
        path: '/',
    })
    }else{
      res.cookie("accessToken", token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None': 'lax',
        maxAge: 3600000,
        path: '/',
    })
    }
    
      res.status(200).json(info);
  } catch (err) {
    console.log(err)
    res.status(500).json({message: err.message});
  }
};

const register = async function (req, res, next) {
  try {
    console.log('req.body', req.body)
    if (!req.body.name || !req.body.password || !req.body.email || !req.body.fullName || !req.body.phoneNumber) {
      return res.status(400).json({message: 'name, email, password, fullName and PhoneNumber are required'})
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json({message: 'User already exists'});

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      role: req?.body?.role || 'normal',
      password: req.body.password
    })
    await newUser.save()
    const newProfile = new Profile({
      fullName: req.body.fullName,
      username: req.body.name,
      email: req.body.email,
      role: req?.body?.role || 'normal',
      phoneNumber: req.body.phoneNumber,
      userId: newUser._id
    })
    await newProfile.save()
    res.status(200).json({newUser, profileId: newProfile._id})
  } catch (e) {
    return res.status(400).json({message: e.message})
  }
}

const isAuth = async (req, res) => {
   try {
    const accessToken = req.cookies.accessToken
    const adminToken = req.cookies.adminToken
    if(!accessToken && !adminToken) return res.status(200).json({message: 'you are not authenticated no token', success: false});
    let userId 
    jwt.verify(adminToken ? adminToken : accessToken , process.env.JWT_SECERET, (err, decoded)=>{
        if(err) return res.status(200).json({message: 'the signed token cannot be verified and decoded', success: false});
        userId = decoded.id
    })
    const user = await User.findById(userId)
    // console.log(user)
    if(!user) {
      return res.status(200).json({message:'user not found'})
    }
      res.status(200).json({success: true, message: 'token was successfully signed', isAdmin: adminToken ? true : false})
   } catch (error) {
     console.log(error)
    return res.status(500).json({message: error.message})
   }
}


const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    if(allUsers.length > 0) {
      res.status(200).json(allUsers)
    }else{
      res.status(400).json({message: "No Users found!"})
    } 
  } catch (error) {
    console.log(error)
    res.status(400).json({message: error.message})
  }
}

const logoutAll = async function (req, res) {
  try {
    const userId = req.userId
    const user = await User.findById(userId)
    user.tokens = []
    await user.save()
    res.clearCookie("accessToken")
    res.clearCookie("adminToken")
    res
      .status(200)
      .send('successfully logged out from all devices')
  } catch (e) {
    res.status(500).json({ e })
  }
}

const deleteUser = async (req, res, next) =>{
  const { userId } = req.params
  if(!userId){
    return res.status(400).json({message: "Can't delete user as id is required"});
  }
  await User.findByIdAndDelete(userId)
  await Profile.deleteOne({userId})
  res.status(200).json({message: "User deleted successfully"})
}

const updateOnlyPassword = async (req, res, next) =>{
  try {
      const userId = req.userId
      if(!userId) throw new Error("Can't get user profile");
      const user = await User.findById(userId)
      if(req.body.currentPassword && req.body.newPassword && req.body.confirmPassword){
          if(req.body.newPassword === req.body.confirmPassword){
              const isCorrect = bcrypt.compareSync(req.body.currentPassword, user.password);
              if(!isCorrect) return res.status(400).json({message: 'Invalid password'})
              user.password = req.body.newPassword;
              await user.save()
          }else{
            return res.status(400).json({message: 'Passwords do not match'})
          }
          return res.status(200).json({message:"Password updated successfully"})
      }else{
          return res.status(400).json({message: "Please fill out the current password, confirm password and new password fields to proceed"})
      }
  } catch (error) {
      console.log(error)
      res.status(400).json({message: error.message})
  }
} 


module.exports = { register, login, logoutAll, getAllUsers, deleteUser, updateOnlyPassword, isAuth }
