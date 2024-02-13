const mongoose = require("mongoose");
// const validator = require("validator"); 
const bcryptjs = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['super', 'normal'],
    default: 'normal'
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
    validate(val) {
      if (!validator.isEmail(val)) throw new Error("invalid email");
    },
  },
  password: {
    type: String,
    trim: true,
    minlength: 8,
    // validate(val) {
    //   let password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])");
    //   if (!password.test(val)) {
    //     throw new Error("password must include uppercase, lowercase, number, special character !@#$%^&*");
    //   }
    // },
  },
  tokens:[{
    type: String
  }],
},{
  timeStamps: true
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  }
});

userSchema.statics.findByCredentials = async (mail, pass) => {
  const user = await User.findOne({ email: mail });
  if (!user) {
    throw new Error("Incorrect Email or Password!, Please check again..")
  }
  const isMatch = await bcryptjs.compare(pass, user.password)
  if (!isMatch) {
    throw new Error("Incorrect Email or Password!, Please check again..")
  }
  return user
}

const User = mongoose.model("User", userSchema);
module.exports = User;