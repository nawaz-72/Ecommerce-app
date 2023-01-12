const User = require('../models/userModel')
const ErrorHandler = require("../utils/errorhandling");
const catchAsyncFunc = require("../middleware/catchAsyncFunc");
const sendtoken = require('../utils/jwt')
const sendEmail = require('../utils/sendEmail')


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

    sendtoken(user, 201, res)
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

    sendtoken(user, 200, res)

})

//logout 

exports.logout = catchAsyncFunc (async (req, res, next) => {

    res.cookie("token", null, {
        expires : new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged out"
    })
})

//forget password

exports.forgetPassword = catchAsyncFunc (async (req, res, next) => {

    const user = await User.findOne({email:req.body.email})

    if(!user)
    {
        return next(new ErrorHandler("User not found", 404))
    }

    //get Reset Password token
    const resetToken = user.getResetPasswordtoken();

    await user.save({ validateBeforeSave: false})

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/ ${resetToken}`

    const message = `your password token is :- \n\n  ${resetPasswordUrl}`

    try{
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })

    }catch(error)
    {
        user.resetpasswordtoken = undefined
        user.resetpasswordexpire =  undefined

        await user.save({ validateBeforeSave: false})

        return next(new ErrorHandler(error.message, 500))

    }
    
})
