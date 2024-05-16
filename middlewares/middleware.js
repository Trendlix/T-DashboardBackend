const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
require('dotenv').config();



const accessUser = async(req, res, next) =>{
    const signedToken = req.cookies.accessToken || req.cookies.adminToken
    if(!signedToken) console.log('No Access token')
    let userId 
    jwt.verify(signedToken , process.env.JWT_SECERET, (err, decoded)=>{
        if(err) return res.status(401).json({message: 'the signed token cannot be verified and decoded'});
        userId = decoded.id
    })
    const user = await User.findById(userId)
    // console.log(user)
    if(!user) return res.status(401).json({message:'user not found'});
    req.userId = userId
    next();
}

const checkAdmin = async (req, res, next) =>{
   try {
        const signedToken = req.cookies.accessToken || req.cookies.adminToken
        let userId 
        jwt.verify(signedToken , process.env.JWT_SECERET, (err, decoded)=>{
            if(err) return res.status(401).json({message:err.message});
            userId = decoded.id
        })
        const user = await User.findById(userId)
        // console.log(user)
        if(!user) return res.status(401).json({message:'User not found'});
        req.userId = userId
        const userRole = user.role
        if(userRole !== "super"){
            return res.status(401).json({message: "You are not allowed to do such action."});
        }
        next();
   } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
   }
}

module.exports = { checkAdmin, accessUser }