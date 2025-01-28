import { Request, Response } from "express";
import { EventService } from "../services/eventService";
import { SearchParams, UpdateEventDTO } from "../types";

export class EventController {
  private events = new EventService();

  async createEvent(req: Request, res: Response) {
    try {
      // to be updated
      const organizerId = 1;
      const event = await this.events.createEvent(organizerId, req.body);
      //const event = await this.events.create(req.user!.id, req.body);
      res.status(201).json(event);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getEvents(req: Request, res: Response) {
    try {
      const events = await this.events.getAllEvents();
      res.json(events);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  async getEventBySlug(req: Request, res: Response) {
    try {
      const event = await this.events.getEventBySlug(String(req.params.slug));
      res.json(event);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const slug = req.params.slug; // Capture the event slug from the request URL
      const eventData: UpdateEventDTO = req.body; // Capture the event data from the request body

      const updatedEvent = await this.events.updateEvent(slug, eventData);

      res
        .status(200)
        .json({ message: "Event updated successfully", data: updatedEvent });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async softDeleteEvent(req: Request, res: Response) {
    try {
      const { slug } = req.params; // Get slug from the route params
      const deletedEvent = await this.events.softDeleteEvent(slug);

      if (!deletedEvent) {
        return res.status(404).json({ error: "Event not found" });
      }

      return res
        .status(200)
        .json({
          message: "Event soft deleted successfully",
          data: deletedEvent,
        });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async searchEvents(req: Request, res: Response) {
    try {
      const { name, category, location, startDate, endDate } = req.query;

      const searchParams: SearchParams = {
        name: name?.toString(),
        category: category?.toString(),
        location: location?.toString(),
        startDate: startDate ? new Date(startDate.toString()) : undefined,
        endDate: endDate ? new Date(endDate.toString()) : undefined,
      };

      const events = await this.events.searchEvents(searchParams);
      if (!events.length) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(events);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getOrganizerEvents(req: Request, res: Response) {
    try {
      const organizerId = 1;
      const events = await this.events.getOrganizerEvents(organizerId);
      res.json(events);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }
}
