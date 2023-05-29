const express = require('express');
const { newOrder, getSingleOrder, getOrders, getAllOrders, updateOrderStatus, deleteOrders } = require('../controllers/orderController');
const router = express.Router();
const {
    isAUthenticatedUser,
    adminAuthorization,
  } = require("../middleware/auth");

router.route('/order/new').post(isAUthenticatedUser, newOrder)
router.route('/order/:id').get(isAUthenticatedUser, getSingleOrder)
router.route('/orders/me').get(isAUthenticatedUser, getOrders)
router.route('/admin/orders').get(isAUthenticatedUser,adminAuthorization('admin'), getAllOrders)
router.route('/admin/order/:id').put(isAUthenticatedUser,adminAuthorization('admin'), updateOrderStatus)
router.route('/admin/order/:id').delete(isAUthenticatedUser,adminAuthorization('admin'), deleteOrders)

module.exports = router;