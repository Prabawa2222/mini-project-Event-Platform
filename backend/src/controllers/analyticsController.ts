import { Request, Response } from "express";
import { EventAnalyticsService } from "../services/analyticsService";

export class AnalyticsController {
  private analyticsService: EventAnalyticsService;

  constructor() {
    this.analyticsService = new EventAnalyticsService();
  }

  getOrganizerDashboardStats = async (req: Request, res: Response) => {
    try {
      const { organizerId } = req.params;
      const { timeframe = "monthly" } = req.query;
      const analytics = await this.analyticsService.getOrganizerDashboardStats(
        Number(organizerId),
        timeframe as string
      );
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  };
}
