const {
  signup,
  signin,
  verifyToken,
  authentication,
  deleteUser,
} = require("../controller/authController");

const router = require("express").Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/users/:id").delete(authentication, deleteUser);

router.route("/userDetails").get(verifyToken);

module.exports = router;
