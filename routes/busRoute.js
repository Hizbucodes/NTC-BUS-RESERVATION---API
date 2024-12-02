const { restrictTo, authentication } = require("../controller/authController");
const {
  createBus,
  getAllBuses,
  updateBus,
  deleteBus,
} = require("../controller/busController");

const router = require("express").Router();

router
  .route("/")
  .post(authentication, restrictTo("admin", "operator"), createBus);

router.route("/getAllBuses").get(authentication, getAllBuses);
router
  .route("/:id")
  .patch(authentication, restrictTo("admin", "operator"), updateBus);
router
  .route("/:id")
  .delete(authentication, restrictTo("admin", "operator"), deleteBus);

module.exports = router;
