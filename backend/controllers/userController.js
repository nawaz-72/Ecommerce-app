const User = require('../models/userModel')
const ErrorHandler = require("../utils/errorhandling");
const catchAsyncFunc = require("../middleware/catchAsyncFunc");

//Register a user
exports.registerUser = catchAsyncFunc(async (req, res, next) => 
{
    const{name, email ,password} = req.body

    const user = await User.create({
        name, email, password,
        avatar:{
            public_id: "this is sample id",
            url: "profilepicurl"
        }
    })

    const token = user.getJWTtoken()

    res.status(201).json({
        success:true,
        user,
        token
    })
})

//Login User

exports.loginUser = catchAsyncFunc (async (req, res, next) => {
    const {email, password} = req.body

    //check user is giver both password and email

    if(!email || !password)
    {
        return next(new ErrorHandler("Please enter Email & Password", 400))
    }

    const user = await User.findOne({email}).select("+password")

    if(!user)
    {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    const isPasswordmatch = await user.comparePassword(password)

    if(!isPasswordmatch)
    {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    const token = user.getJWTtoken()

    res.status(201).json({
        success:true,
        user,
        token
    })

})