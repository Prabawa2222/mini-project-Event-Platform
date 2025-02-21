import { Router } from "express";
import { AnalyticsController } from "../controllers/analyticsController";

const analyticsController = new AnalyticsController();
const router = Router();

//router.use(authMiddleware);

router.get(
  "/organizer/:organizerId",
  analyticsController.getOrganizerDashboardStats
);

export default router;
