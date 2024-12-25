import { restrictTo, authentication } from "../controller/authController.js";
import {
  createBus,
  getAllBuses,
  updateBus,
  deleteBus,
} from "../controller/busController.js";

import { Router } from "express";
const router = Router();

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

export default router;
