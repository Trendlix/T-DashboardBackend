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
    if (!req.body.name || !req.body.password || !req.body.email) {
      throw new Error('name, email and password are required')
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
      fullName: req.body.name,
      username: req.body.name,
      email: req.body.email,
      role: req?.body?.role || 'normal',
      userId: newUser._id
    })
    await newProfile.save()
    res.status(200).json({newUser, profileId: newProfile._id})
  } catch (e) {
    return res.status(400).json({message: e.message})
  }
}

const logoutAll = async function (req, res) {
  try {
    // const accessToken = req.cookies.accessToken
    // if(!accessToken) return res.status(401).json({message: "Access token is required"})
    // let userId
    // jwt.verify(accessToken, process.env.JWT_SECERET, (err, decoded) => {
    //   userId = decoded.id
    // })
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

module.exports = { register, login, logoutAll }
