const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandling");
const catchAsyncFunc = require("../middleware/catchAsyncFunc");
const sendtoken = require("../utils/jwt");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//Register a user
exports.registerUser = catchAsyncFunc(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is sample id",
      url: "profilepicurl",
    },
  });

  sendtoken(user, 201, res);
});

//Login User

exports.loginUser = catchAsyncFunc(async (req, res, next) => {
  const { email, password } = req.body;

  //check user is giver both password and email

  if (!email || !password) {
    return next(new ErrorHandler("Please enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isPasswordmatch = await user.comparePassword(password);

  if (!isPasswordmatch) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendtoken(user, 200, res);
});

//logout

exports.logout = catchAsyncFunc(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

//forget password

exports.forgetPassword = catchAsyncFunc(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //get Reset Password token
  const resetToken = user.getResetPasswordtoken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `your password token is :- \n\n  ${resetPasswordUrl}`;

  console.log(message);

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recovery",
      text: `${message}`,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetpasswordtoken = undefined;
    user.resetpasswordexpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//reset password

exports.resetPassword = catchAsyncFunc(async (req, res, next) => {
  // creating token hash
  const resetPasswordtoken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordtoken,
    resetpasswordexpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetpasswordtoken = undefined;
  user.resetpasswordexpire = undefined;

  await user.save();

  sendtoken(user, 200, res);
});

// Get User Details
exports.getUserDetails = catchAsyncFunc(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Password
exports.updateUserPassword = catchAsyncFunc(async(req,res,next) => {
    const user = await User.findById(req.user.id).select("+password")

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is Incorrect", 400));
    }

    if(req.body.newPassword !== req.body.confirmPassword)
    {
        return next(new ErrorHandler("Password Does not match", 400));
    }

    user.password = req.body.newPassword

    await user.save()
    sendtoken(user, 200, res);


    res.status(200).json({
        success: true,
        user,
      });
})

//updateUserProfile
exports.updateUserProfile = catchAsyncFunc(async(req,res,next) =>{

  const newUserData ={
    name:req.body.name,
    email:req.body.email
  } 

  const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
    new:true,
    runValidators:true,
    userFindAndModify:false
  })

  res.status(200).json({
    sucess:true
  })
})

//get all user (admin)
exports.getAllUser = catchAsyncFunc(async(req,res,next) =>{
  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  })
})


//get user details(admin)
exports.getUserDetail = catchAsyncFunc(async(req, res, next) =>{
  const user = await User.findById(req.params.id);

  if(!user)
  {
    return next(new ErrorHandler(`user does not exit with id: ${req.params.id}`))
  }

  res.status(200).json({
    success: true,
    user
  })
}) 

//update user role
//updateUserRole (admin)
exports.updateUserRole = catchAsyncFunc(async(req,res,next) =>{

  const newUserData ={
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  } 

  const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
    new:true,
    runValidators:true,
    userFindAndModify:false
  })

  res.status(200).json({
    sucess:true
  })
})

//delete user (admin)
exports.deleteUser = catchAsyncFunc(async(req,res,next) =>{
  const user = await User.findById(req.params.id)

  if(!user)
  {
    return next(new ErrorHandler(`user does not exist ${req.params.id}`))
  }
  
  await user.remove()
  res.status(200).json({
    sucess:true,
    message:"user deleted sucessfully"
  })
})
