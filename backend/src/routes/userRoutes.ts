import { Router } from "express";
import { UserController } from "../controllers/userController";
import { ForgotPasswordDto, ResetPasswordDto } from "../types";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
const userController = new UserController();

// Public routes (no authentication required)
router.post("/register", userController.registeUser);
router.post("/login", userController.loginUser);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

router.get("/profile", authenticate, userController.getProfile);
router.put("/profile/:id", authenticate, userController.updateUserProfile);
router.post("/password/:id", authenticate, userController.changeUserPassword);

// Admin only routes
router.post("/expire-coupons", userController.expireCoupons);
router.post("/expire-points", userController.expirePoints);

export default router;
