const Product = require("../models/productmodels");
const ErrorHandler = require("../utils/errorhandling");
const catchAsyncFunc = require("../middleware/catchAsyncFunc");
const APIfeatures = require("../utils/apifeatures");

// Create Product admin
exports.createProduct = catchAsyncFunc(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//get SIngl Product details
exports.getSingleProduct = catchAsyncFunc(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  } else {
    res.status(200).json({
      success: true,
      product,
    });
  }
});

//get all products
exports.getAllProducts = catchAsyncFunc(async (req, res, next) => {
  const resultPerPage = 5;
  //const productCount = await Product.countDocuments();
  const apifeature = await new APIfeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const product = await apifeature.query;
  res.status(200).json({ success: true, product });
});

//update product -- Admin

exports.updateProducts = catchAsyncFunc(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  } else {
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindandModify: false,
    });

    res.status(200).json({
      success: true,
      product,
    });
  }
});

exports.deleteProduct = catchAsyncFunc(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "product is deleted Sucessfully",
  });
});
