const router = require("express").Router();
const { restrictTo, authentication } = require("../controller/authController");
const {
  createBooking,
  getAllBooking,
} = require("../controller/bookingController");

router.route("/").post(authentication, restrictTo("commuter"), createBooking);

router
  .route("/getAllBooking")
  .get(authentication, restrictTo("admin"), getAllBooking);

module.exports = router;
