const Website = require('../models/webisteModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config() 
}

const addWebsite = async (req, res, next) =>{
    try {
        const userId = req.userId
        const { name, domain, adminDomain, type, logo } = req.body
        console.log(req.body)
        const user = await User.findById(userId)
        if(!user){
            return res.status(401).json({message: 'User not found please register first'})
        }else{
            if(name && domain && adminDomain && type && logo){
                const newWebsite = await new Website({
                    name, 
                    domain, 
                    adminDomain, 
                    type, 
                    logo,
                    userId
                })
                await newWebsite.save()
                // const websiteToken = await jwt.sign({id: newWebsite._id}, process.env.JWT_SECERET)
                res.status(200).json({message: "website created successfully"})
            }else{
                return res.status(400).json({message: 'you should fill out all the required fields'})
            }
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error.message})
    }
}

const getWebsites = async (req, res, next) => {
    try {
        const allWebsites = await Website.find()
        if(allWebsites.length > 0) {
            return res.status(200).json(allWebsites)
        }else{
            return res.status(404).json({message: "no websites found"})
        }
    } catch (error) {
        
    }
}

const deletedWebsite = async (req, res, next) =>{
    try {
        const { websiteId } = req.params
        if(!websiteId){
           return res.status(400).json({message: 'bad request'})
        }else{
            const website = await Website.findById(websiteId)
            if(website){
                await Website.deleteOne({_id: websiteId})
                return res.status(200).json({message: 'website deleted successfully'})
            }else{
                return res.status(404).json({message: 'website not found'})
            }
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error.message})  
    }
}

module.exports = {
    addWebsite,
    deletedWebsite,
    getWebsites
}