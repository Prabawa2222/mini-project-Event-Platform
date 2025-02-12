import { Router } from "express";
import { UserController } from "../controllers/userController";

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

router.post("/forgot-password", async (req, res, next) => {
  try {
    await userController.forgotPassword(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    await userController.resetPassword(req, res);
  } catch (error) {
    next(error);
  }
});

//admin only
// to be updated with cornjobs
router.post("/expire-coupons", (req, res) =>
  userController.expireCoupons(req, res)
);

router.post("/expire-points", (req, res) =>
  userController.expirePoints(req, res)
);

export default router;
