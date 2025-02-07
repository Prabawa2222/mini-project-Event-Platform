import { Router } from "express";
import { AnalyticsController } from "../controllers/analyticsController";

const analyticsController = new AnalyticsController();
const router = Router();

//router.use(authMiddleware);

router.get("/events/:eventId", analyticsController.getEventAnalytics);
router.get(
  "/organizer/:organizerId",
  analyticsController.getOrganizerAnalytics
);
router.get("/events/:eventId/sales", analyticsController.getEventSalesOverTime);

export default router;
