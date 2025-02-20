import { Router } from "express";
import { AnalyticsController } from "../controllers/analyticsController";
import { authenticate } from "../middleware/authMiddleware";

const analyticsController = new AnalyticsController();
const router = Router();

//router.use(authMiddleware);

router.get(
  "/organizer/:organizerId",
  authenticate,
  analyticsController.getOrganizerDashboardStats
);

export default router;
