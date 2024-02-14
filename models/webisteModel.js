const mongoose = require('mongoose')

const WebsiteSchema = new mongoose.Schema({
   name: {
    type: String,
    required: true,
   },
   type: {
    type: String,
    required: true,
    enum: ['custom coding', 'wordpress']
   },
   domain: {
    type: String,
    required: true,
   },
   adminDomain: {
    type: String,
    required: true,
   },
   logo:{
    type: String,
    required: true,
   },
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
   }
})

const Website = mongoose.model('Website', WebsiteSchema)

module.exports = Website