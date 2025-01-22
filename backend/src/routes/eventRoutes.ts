import { Router } from "express";
import { EventController } from "../controllers/eventController";

const router = Router();
const events = new EventController();

router.get("/:id", (req, res) => events.getById(req, res));
router.post("/", (req, res) => events.create(req, res));

export default router;
