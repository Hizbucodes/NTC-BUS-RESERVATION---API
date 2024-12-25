import { authentication, restrictTo } from "../controller/authController.js";
import {
  createTrip,
  searchTrips,
  updateTrip,
  cancelTrip,
} from "../controller/tripController.js";

import { Router } from "express";
const router = Router();

router
  .route("/")
  .post(authentication, restrictTo("admin", "operator"), createTrip);

router.route("/search").get(searchTrips);

router
  .route("/:id")
  .patch(authentication, restrictTo("admin", "operator"), updateTrip);

router
  .route("/cancelTrip/:id")
  .delete(authentication, restrictTo("admin", "operator"), cancelTrip);

export default router;
