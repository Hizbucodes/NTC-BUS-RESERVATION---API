const { authentication, restrictTo } = require("../controller/authController");
const {
  createTrip,
  searchTrips,
  updateTrip,
  deleteTrip,
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
  .route("/:id")
  .delete(authentication, restrictTo("admin", "operator"), deleteTrip);

module.exports = router;
