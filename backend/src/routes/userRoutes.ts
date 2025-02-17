import { Router } from "express";
import { UserController } from "../controllers/userController";
import { ForgotPasswordDto, ResetPasswordDto } from "../types";

const router = Router();
const userController = new UserController();

router.post("/register", userController.registeUser);
router.post("/login", userController.loginUser);

router.get("/profile", (req, res) => userController.getProfile(req, res));

router.put("/profile/:id", (req, res) =>
  userController.updateUserProfile(req, res)
);

router.post("/password/:id", (req, res) =>
  userController.changeUserPassword(req, res)
);
router.post("/forgot-password", userController.forgotPassword);

// Reset Password
router.post("/reset-password", userController.resetPassword);

//admin only
// to be updated with cronjobs
router.post("/expire-coupons", (req, res) =>
  userController.expireCoupons(req, res)
);

router.post("/expire-points", (req, res) =>
  userController.expirePoints(req, res)
);

export default router;
