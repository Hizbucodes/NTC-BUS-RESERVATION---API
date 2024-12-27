import { authentication, restrictTo } from "../controller/authController.js";
import {
  createSeatsForBus,
  getSeatsByBus,
} from "../controller/seatController.js";

import { Router } from "express";
const router = Router();

router.route("/").post(authentication, restrictTo("admin"), createSeatsForBus);

router.route("/getSeats/:busId").get(authentication, getSeatsByBus);

export default router;
