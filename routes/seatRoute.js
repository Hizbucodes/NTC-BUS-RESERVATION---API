import { authentication, restrictTo } from "../controller/authController.js";
import {
  createSeatsForBus,
  getSeatsByBus,
} from "../controller/seatController.js";

import { Router } from "express";
const router = Router();

router.route("/").post(authentication, restrictTo("admin"), createSeatsForBus);

router
  .route("/getSeats/:busId")
  .get(authentication, restrictTo("admin"), getSeatsByBus);

export default router;
