const router = require("express").Router();
const { restrictTo, authentication } = require("../controller/authController");
const {
  createBooking,
  getAllBooking,
  cancelBooking,
} = require("../controller/bookingController");

router.route("/").post(authentication, restrictTo("commuter"), createBooking);

router
  .route("/getAllBooking")
  .get(authentication, restrictTo("admin"), getAllBooking);

router
  .route("/cancelBooking/:id")
  .delete(authentication, restrictTo("admin", "commuter"), cancelBooking);

module.exports = router;
