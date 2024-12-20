const { authentication, restrictTo } = require("../controller/authController");
const {
  createTrip,
  searchTrips,
  updateTrip,
  cancelTrip,
} = require("../controller/tripController");

const router = require("express").Router();

router
  .route("/")
  .post(authentication, restrictTo("admin", "operator"), createTrip);

router.route("/search").get(searchTrips);

router
  .route("/:id")
  .patch(authentication, restrictTo("admin", "operator"), updateTrip);

router
  .route("/cancelTrip/:id")
  .delete(authentication, restrictTo("admin", "operator"), cancelTrip);

module.exports = router;
