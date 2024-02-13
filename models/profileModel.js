const mongoose = require("mongoose")
const validator = require("validator")

const ProfileSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    role: {
        type: String,
        enum: ['super', 'normal'],
        default: 'normal',
    },
    photo: {
        type: String,
        default: 'https://banner2.cleanpng.com/20180701/eta/kisspng-computer-icons-user-profile-avatar-icon-5b3899483fa7a8.4711163815304359122607.jpg',
    }
})

const Profile = mongoose.model("Profile", ProfileSchema)

module.exports = Profile