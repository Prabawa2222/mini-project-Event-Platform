import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();
const userController = new UserController();

router.post("/register", userController.registeUser);
router.post("/login", userController.loginUser);

router.put("/profile/:id", (req, res) =>
  userController.updateUserProfile(req, res)
);

router.post("/password/:id", (req, res) =>
  userController.changeUserPassword(req, res)
);

//admin only
// to be updated with cornjobs
router.post("/expire-coupons", (req, res) =>
  userController.expireCoupons(req, res)
);

router.post("/expire-points", (req, res) =>
  userController.expirePoints(req, res)
);

export default router;
