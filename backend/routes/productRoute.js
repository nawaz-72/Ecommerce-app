const express = require("express");
const { getAllProducts,createProduct, updateProducts, deleteProduct, getSingleProduct } = require("../controllers/productController");
const { isAUthenticatedUser, adminAuthorization } = require("../middleware/auth");

const router = express.Router();

router.route('/products').get( getAllProducts) 

router.route('/products/new').post(isAUthenticatedUser, adminAuthorization("admin"),createProduct)

router.route('/products/:id').put(isAUthenticatedUser, adminAuthorization("admin"),updateProducts).delete(isAUthenticatedUser, adminAuthorization("admin"),deleteProduct).get(getSingleProduct)

module.exports = router;