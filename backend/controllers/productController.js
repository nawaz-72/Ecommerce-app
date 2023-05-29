const Product = require("../models/productmodels");
const ErrorHandler = require("../utils/errorhandling");
const catchAsyncFunc = require("../middleware/catchAsyncFunc");
const APIfeatures = require("../utils/apifeatures");

// Create Product admin
exports.createProduct = catchAsyncFunc(async (req, res, next) => {

  req.body.user = req.user.id
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

//deleteProduct

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

//create new review or update the review
exports.createProductReview = catchAsyncFunc(async(req, res, next) =>
{
  const{rating, comment, productID} = req.body;
  const reviews = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productID)
  const isReviewed = product.reviews.find((rev) => 
    rev.user.toString() === req.user._id.toString())

  if(isReviewed)
  {
    product.reviews.forEach((rev) => {
      if(rev.user.toString() === req.user._id.toString())
      {
        rev.rating = rating
        rev.comment = comment
      }
      
    });
  }
  else
  {
    product.reviews.push(reviews)
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) =>{
    avg += rev.rating;
  })

  product.ratings = avg / product.reviews.length;

  await product.save({validateBeforeSave: false})
  res.status(200).json({
    success:true
  })
})

//get all reviews of product
exports.getProductReviews = catchAsyncFunc(async(req,res,next) => {
  const product = await Product.findById(req.query.id);

  if(!product)
  {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success:true,
    reviews: product.reviews
  })
})

//Delete Review
exports.deleteReview = catchAsyncFunc(async(req,res,next) => {
  const product = await Product.findById(req.query.productid);

  if(!product)
  {
    return next(new ErrorHandler("Product not found", 404));
  }

  const review = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())
  console.log(review)

  //set rating 
  let avg = 0;
  review.forEach((rev) =>{
    avg += rev.rating;
  })

  const ratings = avg / review.length;

  const numOfReviews = review.length;
  await Product.findByIdAndUpdate(req.query.productid,{
    reviews: review,
    ratings,
    numOfReviews
  },
  {
    new:true,
    runValidators:true,
    useFindandModify: false
  })

  res.status(200).json({
    success:true,
  })
})
