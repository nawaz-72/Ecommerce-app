const ErrorHandler = require('../utils/errorhandling')

module.exports = (err,req,res,next) =>
{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Interenal Server Error"

    //Wrong MongoDB id error
    if(err.name === "CastError")
    {
        const message = `Resource not found. Invalid: ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    //DuplicateKey Error 
    if(err.code === 11000)
    {
        const message = `This ${Object.keys(err.keyValue)} Already Exist`
        err = new ErrorHandler(message, 400)
    }

     //Wrong JWT
     if(err.name === "JsonWebTokenError")
     {
         const message = `Json Web token is Invalid, Try again`
         err = new ErrorHandler(message, 400)
     }

     //Expire JWT error
     if(err.name === "TokenExpiredError")
     {
         const message = `Json Web token is Expired, Try again`
         err = new ErrorHandler(message, 400)
     }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        error: err.stack
    })
}