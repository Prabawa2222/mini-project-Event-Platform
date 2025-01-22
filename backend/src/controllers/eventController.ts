import { Request, Response } from "express";
import { EventService } from "../services/eventService";

export class EventController {
  private events = new EventService();

  async create(req: Request, res: Response) {
    try {
      const organizerId = 1;
      const event = await this.events.create(organizerId, req.body);
      //const event = await this.events.create(req.user!.id, req.body);
      res.status(201).json(event);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const event = await this.events.getById(Number(req.params.id));
      res.json(event);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }
}
