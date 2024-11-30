const { createRoute, getAllRoutes } = require("../controller/routeController");

const router = require("express").Router();

router.route("/").post(createRoute);
router.route("/getAllRoutes").get(getAllRoutes);

module.exports = router;
