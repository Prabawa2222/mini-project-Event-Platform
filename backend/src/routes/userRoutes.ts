import { Router } from "express";
import { createUser, getUsers, loginUser } from "../controllers/userController";

const router = Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/", getUsers);

export default router;
