const express = require("express");
const { getAllProducts,createProduct, updateProducts, deleteProduct, getSingleProduct } = require("../controllers/productController");
const { isAUthenticatedUser, adminAuthorization } = require("../middleware/auth");

const router = express.Router();

router.route('/products').get(isAUthenticatedUser, adminAuthorization("admin"), getAllProducts) 

router.route('/products/new').post(createProduct)

router.route('/products/:id').put(updateProducts).delete(deleteProduct).get(getSingleProduct)

module.exports = router;