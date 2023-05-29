const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProducts,
  deleteProduct,
  getSingleProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController");
const {
  isAUthenticatedUser,
  adminAuthorization,
} = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);

router
  .route("/products/new")
  .post(isAUthenticatedUser, adminAuthorization("admin"), createProduct);

router
  .route("/products/:id")
  .put(isAUthenticatedUser, adminAuthorization("admin"), updateProducts)
  .delete(isAUthenticatedUser, adminAuthorization("admin"), deleteProduct)
  .get(getSingleProduct);

router.route("/review").put(isAUthenticatedUser, createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAUthenticatedUser, deleteReview);
module.exports = router;
