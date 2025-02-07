import { Request, Response } from "express";
import { EventAnalyticsService } from "../services/analyticsService";

export class AnalyticsController {
  private analyticsService: EventAnalyticsService;

  constructor() {
    this.analyticsService = new EventAnalyticsService();
  }

  getEventAnalytics = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      const analytics = await this.analyticsService.getEventAnalytics(
        Number(eventId)
      );
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event analytics" });
    }
  };

  getOrganizerAnalytics = async (req: Request, res: Response) => {
    try {
      const { organizerId } = req.params;
      const analytics = await this.analyticsService.getOrganizerAnalytics(
        Number(organizerId)
      );
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organizer analytics" });
    }
  };

  getEventSalesOverTime = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      const { interval = "daily" } = req.query;
      const sales = await this.analyticsService.getSalesOverTime(
        Number(eventId),
        interval as "daily" | "weekly" | "monthly"
      );
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales data" });
    }
  };
}
