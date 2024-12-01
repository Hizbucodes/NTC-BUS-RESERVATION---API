const { authentication, restrictTo } = require("../controller/authController");
const {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} = require("../controller/routeController");

const router = require("express").Router();

router.route("/").post(authentication, restrictTo("admin"), createRoute);
router.route("/getAllRoutes").get(authentication, getAllRoutes);
router.route("/:id").get(authentication, restrictTo("admin"), getRouteById);
router.route("/:id").patch(authentication, restrictTo("admin"), updateRoute);
router.route("/:id").delete(authentication, restrictTo("admin"), deleteRoute);

module.exports = router;
