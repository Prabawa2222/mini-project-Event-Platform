import { Request, Response } from "express";
import { ReviewService } from "../services/reviewService";

export class ReviewController {
  private reviewService = new ReviewService();

  constructor() {
    this.reviewService = new ReviewService();
  }

  async createReview(req: Request, res: Response): Promise<void> {
    const { userId, eventId, rating, comment } = req.body;
    try {
      const review = await this.reviewService.createReview(
        userId,
        eventId,
        rating,
        comment
      );
      res.send(review);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getEventReviews(req: Request, res: Response): Promise<void> {
    const { eventId } = req.params;
    try {
      const reviews = await this.reviewService.getEventReviews(Number(eventId));
      res.send(reviews);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getOrganizerReviews(req: Request, res: Response): Promise<void> {
    const { organizerId } = req.params;

    try {
      const reviews = await this.reviewService.getOrganizerReviews(
        Number(organizerId)
      );
      res.send(reviews);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
