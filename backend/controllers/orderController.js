const Order = require("../models/orderModel");
const Product = require("../models/productmodels");
const ErrorHandler = require("../utils/errorhandling");
const catchAsyncFunc = require("../middleware/catchAsyncFunc");
const APIfeatures = require("../utils/apifeatures");

// Create new Order
exports.newOrder = catchAsyncFunc(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    sucess: true,
    order 
  })
});

//get single order detail

exports.getSingleOrder = catchAsyncFunc(async(req,res,next) =>{
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    )

    if(!order)
    {
        return next(new ErrorHandler("Order not found with this id",404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

//get all user order

exports.getOrders = catchAsyncFunc(async(req,res,next) =>{
    const orders = await Order.find({user:req.user._id})

    if(!orders)
    {
        return next(new ErrorHandler("Order not found with this id",404))
    }

    res.status(200).json({
        success: true,
        orders
    })
})

//get all orders --Admin
exports.getAllOrders = catchAsyncFunc(async(req,res,next)=>{
  const orders= await Order.find();

  let totalAmount = 0;

  orders.forEach((order)=>{
    totalAmount = order.totalPrice;
  })

  res.status(200).json({
    success: true,
    totalAmount,
    orders

})
})

// update order status --Admin
exports.updateOrderStatus = catchAsyncFunc(async(req,res,next)=>{
  const order= await Order.findById(req.params.id);

  if(!orders)
    {
        return next(new ErrorHandler("Order not found with this id",404))
    }

  if(order.orderStatus === "Delivered" )
  {
    return next(new ErrorHandler("You have already delivered this Order", 404))
  }

  order.orderItems.forEach( async(order)=>{
    await updateStock(order.product, order.quantity)
  })

  order.orderStatus = req.body.status
  
  if(req.body.status === "Delivered")
  {
    order.deliverdAt = Date.now();
  }

  await order.save({validateBeforeSave: false})

  res.status(200).json({
    success: true,
    order

});
})

async function updateStock(id, quantity)
{
  const product = await Product.findById(id);

  product.Stock -= quantity;
  await product.save({validateBeforeSave:false})
}

//delete order
exports.deleteOrders = catchAsyncFunc(async(req,res,next)=>{
  const orders= await Order.findById(req.params.id);

  if(!orders)
    {
        return next(new ErrorHandler("Order not found with this id",404))
    }

  await orders.remove();


  res.status(200).json({
    success: true,

})
})