import express from "express";
import { ReviewController } from "../controllers/reviewController";

const reviewController = new ReviewController();
const router = express.Router();

router.post("/", (req, res) => reviewController.createReview(req, res));
router.get("/event/:eventId", (req, res) =>
  reviewController.getEventReviews(req, res)
);
router.get("/organizer/:organizerId", (req, res) =>
  reviewController.getOrganizerReviews(req, res)
);

export default router;
