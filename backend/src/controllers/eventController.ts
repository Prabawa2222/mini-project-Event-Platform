import { Request, Response } from "express";
import { EventService } from "../services/eventService";
import { CreateVoucherInput, SearchParams, UpdateEventDTO } from "../types";
import { ImageService } from "../services/utilService";
import multer from "multer";
import { EventCategory } from "@prisma/client";

export class EventController {
  private events = new EventService();
  private imageService = new ImageService();

  async createEvent(req: Request, res: Response) {
    ImageService.upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ error: "File upload error: " + err.message });
      }
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      try {
        const eventData = JSON.parse(req.body.data);
        const event = await this.events.createEvent(
          eventData.organizerId,
          eventData,
          req.file
        );
        res.status(201).json(event);
      } catch (err: any) {
        res
          .status(400)
          .json({ error: err.message || "Unknown error occurred" });
      }
    });
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

  async getUpcomingEvents(req: Request, res: Response) {
    try {
      const events = await this.events.getUpcomingEvents();
      res.send(events);
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

      return res.status(200).json({
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

  async searchOrganizerEvents(req: Request, res: Response) {
    try {
      const organizerId = parseInt(req.params.organizerId);
      const { name, category } = req.query;

      const events = await this.events.searchOrganizerEvents(
        organizerId,
        name as string,
        category as EventCategory
      );

      res.json(events);
    } catch (error) {
      res.status(500).json({
        message: "Error searching events",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getOrganizerEvents(req: Request, res: Response) {
    try {
      const organizerId = req.body.organizerId;
      const events = await this.events.getOrganizerEvents(organizerId);
      res.json(events);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  async createVoucherBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const input: CreateVoucherInput = req.body;

      const voucher = await this.events.createVoucherBySlug(slug, input);
      res.status(201).send({
        message: "Voucher created successfully",
        data: voucher,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
