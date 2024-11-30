const {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
} = require("../controller/routeController");

const router = require("express").Router();

router.route("/").post(createRoute);
router.route("/getAllRoutes").get(getAllRoutes);
router.route("/:id").get(getRouteById);
router.route("/:id").patch(updateRoute);

module.exports = router;
