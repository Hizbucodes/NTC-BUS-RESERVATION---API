import { authentication, restrictTo } from "../controller/authController.js";
import {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} from "../controller/routeController.js";

import { Router } from "express";
const router = Router();

router.route("/").post(authentication, restrictTo("admin"), createRoute);
router.route("/getAllRoutes").get(getAllRoutes);
router.route("/:id").get(authentication, restrictTo("admin"), getRouteById);
router.route("/:id").patch(authentication, restrictTo("admin"), updateRoute);
router.route("/:id").delete(authentication, restrictTo("admin"), deleteRoute);

export default router;
