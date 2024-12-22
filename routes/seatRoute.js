const { authentication, restrictTo } = require("../controller/authController");
const { createSeatsForBus } = require("../controller/seatController");

const router = require("express").Router();

router.route("/").post(authentication, restrictTo("admin"), createSeatsForBus);

module.exports = router;
