import { Router } from "express";
import { EventController } from "../controllers/eventController";

const router = Router();
const events = new EventController();

router.get("/search", async (req, res) => {
  await events.searchEvents(req, res);
}); // Search events
router.get("/", (req, res) => events.getEvents(req, res)); // Home page
router.post("/organizer", (req, res) => events.getOrganizerEvents(req, res));
router.get("/up-coming", (req, res) => events.getUpcomingEvents(req, res));
router.get("/:slug", (req, res) => events.getEventBySlug(req, res)); // Event details
router.post("/", (req, res) => events.createEvent(req, res)); // Create event
router.get("/:slug/attendees", (req, res) =>
  events.getEventAttendees(req, res)
);
router.post("/:slug/voucher", (req, res) =>
  events.createVoucherBySlug(req, res)
);
router.get("/organizer/:organizerId/events/search", (req, res) =>
  events.searchOrganizerEvents(req, res)
);
router.patch("/:slug", (req, res) => events.updateEvent(req, res)); // Update event
router.delete("/:slug", async (req, res) => {
  await events.softDeleteEvent(req, res);
}); // Soft delete event

export default router;
