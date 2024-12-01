const { authentication } = require("../controller/authController");
const {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} = require("../controller/routeController");

const router = require("express").Router();

router.route("/").post(authentication, createRoute);
router.route("/getAllRoutes").get(authentication, getAllRoutes);
router.route("/:id").get(authentication, getRouteById);
router.route("/:id").patch(authentication, updateRoute);
router.route("/:id").delete(authentication, deleteRoute);

module.exports = router;
