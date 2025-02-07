import { Request, Response } from "express";
import { EventAnalyticsService } from "../services/analyticsService";

export class AnalyticsController {
  private analyticsService: EventAnalyticsService;

  constructor() {
    this.analyticsService = new EventAnalyticsService();
  }

  async getEventAnalytics(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      const analytics = await this.analyticsService.getEventAnalytics(
        Number(eventId)
      );
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event analytics" });
    }
  }

  async getOrganizerAnalytics(req: Request, res: Response) {
    try {
      const { organizerId } = req.params;
      const analytics = await this.analyticsService.getOrganizerAnalytics(
        Number(organizerId)
      );
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organizer analytics" });
    }
  }

  async getEventSalesOverTime(req: Request, res: Response) {
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
  }
}
