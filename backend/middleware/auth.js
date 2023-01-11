const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandling");
const catchAsyncFunc = require("../middleware/catchAsyncFunc");
const jwt = require("jsonwebtoken");

exports.isAUthenticatedUser = catchAsyncFunc(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resources", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.adminAuthorization = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};
