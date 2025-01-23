import { Router } from "express";
import { EventController } from "../controllers/eventController";

const router = Router();
const events = new EventController();

router.get("/:id", (req, res) => events.getEventById(req, res));
router.post("/", (req, res) => events.createEvent(req, res));

export default router;
