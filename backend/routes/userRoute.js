const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgetPassword,
  resetPassword,
  getUserDetails,
  updateUserPassword,
  updateUserProfile,
  getAllUser,
  getUserDetail,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { isAUthenticatedUser,adminAuthorization, } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forget").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAUthenticatedUser, getUserDetails);
router.route("/password/update").put(isAUthenticatedUser, updateUserPassword);
router.route("/me/profile").put(isAUthenticatedUser, updateUserProfile);
router
  .route("/admin/users")
  .get(isAUthenticatedUser, adminAuthorization("admin"), getAllUser);
router
  .route("/admin/user/:id")
  .get(isAUthenticatedUser, adminAuthorization("admin"), getUserDetail).put(isAUthenticatedUser, adminAuthorization("admin"), updateUserRole).delete(isAUthenticatedUser, adminAuthorization("admin"), deleteUser   );
router.route("/logout").get(logout);

module.exports = router;
