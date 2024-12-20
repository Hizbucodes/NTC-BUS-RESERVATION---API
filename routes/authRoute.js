const { signup, signin, verifyToken } = require("../controller/authController");

const router = require("express").Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);

router.route("/userDetails").get(verifyToken);

module.exports = router;
