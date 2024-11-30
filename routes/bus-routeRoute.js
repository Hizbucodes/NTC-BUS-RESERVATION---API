const { createRoute } = require("../controller/routeController");

const router = require("express").Router();

router.route("/").post(createRoute);

module.exports = router;
