const mongoose = require("mongoose");

module.exports = (thefunc) => (req,res,next) =>
{
    mongoose.Promise = global.Promise
    Promise.resolve(thefunc(req,res,next)).catch(next)
}