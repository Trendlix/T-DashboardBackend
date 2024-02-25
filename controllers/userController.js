const User = require('../models/userModel')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Profile = require('../models/profileModel')

if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config() 
}

// Login
const login = async function (req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("Wrong password or email!");

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) throw new Error("Wrong password or email!");

    console.log('JWT_SECERET', process.env.JWT_SECERET)
    const token = jwt.sign( { id: user._id, email: user.email }, process.env.JWT_SECERET );
    user.tokens=user.tokens.concat(token);
    user.save(); 
    const { password, ...info } = user._doc;
    res.cookie("accessToken", token, { httpOnly: false, })
      .status(200).json(info);
  } catch (err) {
    console.log(err)
    res.status(500).json({message: err.message});
  }
};

const register = async function (req, res, next) {
  try {
    console.log('req.body', req.body)
    if (!req.body.name || !req.body.password || !req.body.email || !req.body.fullName || !req.body.phoneNumber) {
      throw new Error('name, email, password, fullName and PhoneNumber are required')
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) throw new Error('User already exists');

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
    res
      .clearCookie("accessToken", {httpOnly: true})
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

// const checkingAdmin = async (req, res, next) => {
//   try {
//     const signedToken = req.cookies.accessToken
//     let userId 
//     jwt.verify(signedToken , process.env.JWT_SECERET, (err, decoded)=>{
//         if(err) return res.status(401).json({message:err.message});
//         userId = decoded.id
//     })
//     const user = await User.findById(userId)
//     // console.log(user)
//     if(!user) return res.status(401).json({message:err.message});
//     req.userId = userId
//     const userRole = user.role
//     if(userRole !== "super"){
//         return res.status(401).json({message: "You are not allowed to do such action."});
//     }
// } catch (error) {
//     console.log(error)
//     res.status(500).json({message:error.message});
// } 
// }

module.exports = { register, login, logoutAll, getAllUsers, deleteUser }
