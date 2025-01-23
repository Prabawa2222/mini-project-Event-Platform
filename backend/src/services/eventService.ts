import { CreateEventDto } from "../types";
import { PrismaClient } from "@prisma/client";

export class EventService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createEvent(organizerId: number, eventData: any) {
    const totalSeats = eventData.ticketTypes.reduce(
      (sum: number, ticket: any) => sum + ticket.quantity,
      0
    );
    return this.prisma.event.create({
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

  async getEventById(eventId: number) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        ticketTypes: true,
        organizer: { select: { id: true, name: true } },
      },
    });
    if (!event) throw new Error("Event not found");
    return event;
  }

  async getOrganizerEvents(organizerId: number) {
    return await this.prisma.event.findMany({
      include: {
        ticketTypes: true,
        transactions: {
          select: {
            status: true,
            totalPrice: true,
            quantity: true,
          },
        },
      },
    });
  }
}
