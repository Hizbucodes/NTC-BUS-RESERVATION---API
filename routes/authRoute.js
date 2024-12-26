import { Router } from "express";
import {
  signup,
  signin,
  verifyToken,
  authentication,
  deleteUser,
  getAllUsersWithOperatorRole,
  restrictTo,
} from "../controller/authController.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router
  .route("/operators")
  .get(authentication, restrictTo("admin"), getAllUsersWithOperatorRole);
router.route("/deleteMe").delete(authentication, deleteUser);

router.route("/userDetails").get(verifyToken);

export default router;
