const { truncate } = require("fs");
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true, "Please Enter product Description"]
    },
    price:{
        type:Number,
        required:[true, "Please Enter product Price"],
        maxLength:[8,"Price cannot exceed 8 characters"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
        {
        public_id:{
            type:String,
            require:true
        },
        url:{
            type:String,
            required:true
        }
    }
    ],
    category:{
        type:String,
        required:[true, "Please Enter product Category"]
    },
    Stock:{
        type:Number,
        required:[true,"Please Enter Product Stock"],
        maxLength:[4,"Stock cannot exceed 4 characters"],
        default:1
    },
    reviews:[
        {
            name:{
                type:String,
                required: true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    
    user:{
        type:mongoose.Schema.ObjectId,
        ref: "User",
        require: true
    },
     createAt:{  
        type:Date,
        defualt:Date.now
     }
})

module.exports = mongoose.model("Product",productSchema)