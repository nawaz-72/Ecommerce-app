const Product = require("../models/productmodels");




// Create Product admin
 exports.createProduct = async(req,res, next) =>{
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
 }


 //get all products
exports.getAllProducts = async(req,res) => 
{
    const product = await Product.find();
    res.status(200).json({ success:true,
        product})
}