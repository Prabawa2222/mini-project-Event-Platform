import { Router } from "express";
import { EventController } from "../controllers/eventController";

const router = Router();
const events = new EventController();

router.get("/", (req, res) => events.getEvents(req, res)); // Home page
router.get("/:slug", (req, res) => events.getEventBySlug(req, res)); // Event details
router.post("/", (req, res) => events.createEvent(req, res)); // Create event
router.patch("/:slug", (req, res) => events.updateEvent(req, res)); // Update event
// router.delete("/:slug", (req, res) => events.softDeleteEvent(req, res)); // Soft delete event
// router.get("/search", (req, res) => events.searchEvents(req, res)); // Search events

export default router;
