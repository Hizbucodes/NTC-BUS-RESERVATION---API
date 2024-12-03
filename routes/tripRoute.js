const { authentication, restrictTo } = require("../controller/authController");
const { createTrip, searchTrips } = require("../controller/tripController");

const router = require("express").Router();

router
  .route("/")
  .post(authentication, restrictTo("admin", "operator"), createTrip);

router.route("/search").get(authentication, searchTrips);

module.exports = router;
