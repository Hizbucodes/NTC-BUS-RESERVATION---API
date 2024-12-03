const { authentication, restrictTo } = require("../controller/authController");
const { createTrip } = require("../controller/tripController");

const router = require("express").Router();

router
  .route("/")
  .post(authentication, restrictTo("admin", "operator"), createTrip);

module.exports = router;
