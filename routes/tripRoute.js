import { authentication, restrictTo } from "../controller/authController.js";
import {
  createTrip,
  searchTrips,
  updateTrip,
  cancelTrip,
  getTripById,
  getAllTrip,
  getScheduledTrips,
} from "../controller/tripController.js";

import { Router } from "express";
const router = Router();

router.route("/").post(authentication, restrictTo("admin"), createTrip);

router.route("/search").get(searchTrips);

router.route("/:id").patch(authentication, restrictTo("admin"), updateTrip);

router
  .route("/getTripById/:id")
  .get(authentication, restrictTo("admin"), getTripById);

router
  .route("/getAllTrip")
  .get(authentication, restrictTo("admin"), getAllTrip);

router
  .route("/getAllScheduledTrip")
  .get(authentication, restrictTo("operator"), getScheduledTrips);

router
  .route("/cancelTrip/:id")
  .delete(authentication, restrictTo("admin"), cancelTrip);

export default router;
