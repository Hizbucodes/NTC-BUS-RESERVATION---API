const router = require("express").Router();
const { restrictTo, authentication } = require("../controller/authController");
const { createBooking } = require("../controller/bookingController");

router.route("/").post(authentication, restrictTo("commuter"), createBooking);

module.exports = router;
