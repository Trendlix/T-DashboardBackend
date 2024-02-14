const Website = require('../models/webisteModel');
const User = require('../models/userModel');
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const mongoose = require('mongoose');

const addWebsite = async (req, res, next) =>{
    try {
        const { userId } = req.params
        const { name, domain, adminDomain, type, logo } = req.body
        console.log(req.body)
        const user = await User.findById(userId)
        if(!user){
            res.status(401).json({message: 'User not found please register first'})
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
                res.status(200).json(newWebsite)
            }else{
                res.status(400).json({message: 'you should fill out all the required fields'})
            }
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error.message})
    }
}

const deletedWebsite = async (req, res, next) =>{
    try {
        const { websiteId } = req.params
        if(!websiteId){
            res.status(400).json({message: 'bad request'})
        }else{
            const website = await Website.findById(websiteId)
            if(website){
                await Website.deleteOne({_id: websiteId})
                res.status(200).json({message: 'website deleted successfully'})
            }else{
                res.status(404).json({message: 'website not found'})
            }
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error.message})  
    }
}

module.exports = {
    addWebsite,
    deletedWebsite
}