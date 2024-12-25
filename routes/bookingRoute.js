import { restrictTo, authentication } from "../controller/authController.js";
import {
  getAllBooking,
  cancelBooking,
  reserveSeats,
  completeBooking,
} from "../controller/bookingController.js";

import { Router } from "express";
const router = Router();

router
  .route("/reserve")
  .post(authentication, restrictTo("commuter"), reserveSeats);

router
  .route("/complete")
  .post(authentication, restrictTo("commuter"), completeBooking);

router
  .route("/getAllBooking")
  .get(authentication, restrictTo("admin"), getAllBooking);

router
  .route("/cancelBooking/:id")
  .delete(authentication, restrictTo("admin", "commuter"), cancelBooking);

export default router;
