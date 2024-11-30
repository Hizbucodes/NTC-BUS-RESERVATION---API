const {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} = require("../controller/routeController");

const router = require("express").Router();

router.route("/").post(createRoute);
router.route("/getAllRoutes").get(getAllRoutes);
router.route("/:id").get(getRouteById);
router.route("/:id").patch(updateRoute);
router.route("/:id").delete(deleteRoute);

module.exports = router;
