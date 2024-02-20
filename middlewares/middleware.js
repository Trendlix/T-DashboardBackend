const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


const accessUser = async(req, res, next) =>{
    const signedToken = req.cookies.accessToken
    let userId 
    jwt.verify(signedToken , process.env.JWT_SECERET, (err, decoded)=>{
        if(err) return res.status(401).json({message:err.message});
        userId = decoded.id
    })
    const user = await User.findById(userId)
    // console.log(user)
    if(!user) return res.status(401).json({message:err.message});
    req.userId = userId
    next();
}

const checkAdmin = async (req, res, next) =>{
   try {
        const signedToken = req.cookies.accessToken
        let userId 
        jwt.verify(signedToken , process.env.JWT_SECERET, (err, decoded)=>{
            if(err) return res.status(401).json({message:err.message});
            userId = decoded.id
        })
        const user = await User.findById(userId)
        // console.log(user)
        if(!user) return res.status(401).json({message:err.message});
        req.userId = userId
        const userRole = user.role
        if(userRole !== "super"){
            return res.status(401).json({message: "You are not allowed to create new users"});
        }
        next();
   } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
   }
}

module.exports = { checkAdmin, accessUser }