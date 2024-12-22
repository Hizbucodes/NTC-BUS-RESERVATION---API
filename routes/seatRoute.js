const { authentication, restrictTo } = require("../controller/authController");
const {
  createSeatsForBus,
  getSeatsByBus,
} = require("../controller/seatController");

const router = require("express").Router();

router.route("/").post(authentication, restrictTo("admin"), createSeatsForBus);

router
  .route("/getSeats/:busId")
  .get(authentication, restrictTo("admin"), getSeatsByBus);

module.exports = router;
