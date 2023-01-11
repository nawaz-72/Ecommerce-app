const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your name"],
    maxLength: [30, "Name cannot Exceed 30 Characters"],
    minLength: [4, "Name should have more than 4 Characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your password"],
    minLength: [10, "password should be greater than 10 Characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role:{
    type:String,
    default: "user"
  },

  resetpasswordtoken:String,
  resetpasswordexpire:Date,

});

//converted to hashpassword

userSchema.pre("save",async function (next){
  if(!this.isModified("password"))
  {
    next()
  }
  this.password = await bcrypt.hash(this.password,10)
})

// set JWT token
userSchema.methods.getJWTtoken = function () {
  return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_ExpireTime
  })
}

// comparePassword

userSchema.methods.comparePassword = async function (getpassword) {
  return await bcrypt.compare(getpassword, this.password)
}

module.exports = mongoose.model("User", userSchema)
