const {
  createRoute,
  getAllRoutes,
  getRouteById,
} = require("../controller/routeController");

const router = require("express").Router();

router.route("/").post(createRoute);
router.route("/getAllRoutes").get(getAllRoutes);
router.route("/:id").get(getRouteById);

module.exports = router;
