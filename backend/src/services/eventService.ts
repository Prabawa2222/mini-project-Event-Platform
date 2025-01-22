import { CreateEventDto } from "../types";
import { PrismaClient } from "@prisma/client";

export class EventService {
  private db = new PrismaClient();

  async create(organizerId: number, eventData: any) {
    const totalSeats = eventData.ticketTypes.reduce(
      (sum: number, ticket: any) => sum + ticket.quantity,
      0
    );
    return this.db.event.create({
      data: {
        name: eventData.name,
        description: eventData.description,
        location: eventData.location,
        organizerId,
        price: 0,
        startDate: new Date(eventData.date),
        endDate: new Date(eventData.date),
        availableSeats: totalSeats,
        category: "General",
        ticketTypes: {
          create: eventData.ticketTypes,
        },
      },
      include: { ticketTypes: true },
    });
  }

  async getById(id: number) {
    const event = await this.db.event.findUnique({
      where: { id },
      include: {
        ticketTypes: true,
        organizer: { select: { id: true, name: true } },
      },
    });
    if (!event) throw new Error("Event not found");
    return event;
  }
}
