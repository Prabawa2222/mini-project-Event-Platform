import { searchEvents } from "../helpers/searchBar";
import { slugGenerator } from "../helpers/slug.generator";
import {
  CreateEventDto,
  CreateVoucherInput,
  EventPreview,
  UpdateEventDTO,
} from "../types";

import { EventCategory, PrismaClient, Promotion } from "@prisma/client";
import { ImageService } from "./utilService";

export class EventService {
  private prisma: PrismaClient;
  private imageService: ImageService;

  constructor() {
    this.prisma = new PrismaClient();
    this.imageService = new ImageService();
  }

  // Create Event Page
  async createEvent(
    organizerId: number,
    eventData: any,
    file?: Express.Multer.File
  ) {
    let imageUrl = null;

    if (file) {
      imageUrl = await this.imageService.uploadImage(file);
    }

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
        startDate: new Date(eventData.startDate),
        endDate: new Date(eventData.endDate),
        availableSeats: totalSeats,
        category: eventData.category as EventCategory,
        slug: slugGenerator(eventData.name),
        imageUrl,
        ticketTypes: {
          create: eventData.ticketTypes,
        },
        promotions: eventData.promotions
          ? {
              create: eventData.promotions.map((promo: any) => ({
                discount: promo.discount,
                startDate: new Date(promo.startDate),
                endDate: new Date(promo.endDate),
                maxUses: promo.maxUses,
                code: Math.random().toString(36).substring(2, 12).toUpperCase(),
              })),
            }
          : undefined,
      },
      include: {
        ticketTypes: true,
        promotions: true,
      },
    });
  }

  // Home Page
  async getAllEvents(): Promise<EventPreview[]> {
    const events = await this.prisma.event.findMany({
      select: {
        name: true,
        slug: true,
        description: true,
        price: true,
        startDate: true,
        category: true,
        location: true,
      },
    });
    return events.map((event) => ({
      name: event.name,
      slug: event.slug,
      price: event.price,
      description: event.description.slice(0, 50) + "...", // Potong description
      startDate: event.startDate,
      category: event.category,
      location: event.location,
    }));
  }

  async getEventAttendees(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        transactions: {
          where: {
            status: "DONE",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profilePicture: true,
              },
            },
            ticketType: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!event) throw new Error("Event not found");

    const attendees = event.transactions.map((transaction) => ({
      userId: transaction.user.id,
      name: transaction.user.name,
      email: transaction.user.email,
      profilePicture: transaction.user.profilePicture,
      ticketType: transaction.ticketType.name,
      quantity: transaction.quantity,
      purchaseDate: transaction.createdAt,
      price: transaction.ticketType.price,
    }));

    return attendees;
  }

  // Detail Event Page
  async getEventBySlug(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        ticketTypes: true,
        organizer: { select: { id: true, name: true } },
        promotions: true,
        reviews: {
          take: 5,
        },
      },
    });
    if (!event) throw new Error("Event not found");
    return event;
  }

  async getUpcomingEvents(): Promise<EventPreview[]> {
    const currentDate = new Date();
    const events = await this.prisma.event.findMany({
      where: {
        startDate: {
          gt: currentDate,
        },
        deletedAt: null,
      },
      select: {
        name: true,
        description: true,
        price: true,
        startDate: true,
        category: true,
        location: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return events.map((event) => ({
      name: event.name,
      price: event.price,
      description: event.description.slice(0, 50) + "...",
      startDate: event.startDate,
      category: event.category,
      location: event.location,
    }));
  }

  async updateEvent(slug: string, eventData: UpdateEventDTO) {
    const totalSeats = eventData.ticketTypes
      ? eventData.ticketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0)
      : undefined;

    return await this.prisma.event.update({
      where: { slug: slug },
      data: {
        name: eventData.name,
        description: eventData.description,
        price: eventData.price,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        availableSeats: totalSeats ?? undefined,
        category: eventData.category,
        location: eventData.location,
        slug: eventData.name ? slugGenerator(eventData.name) : undefined,
        ticketTypes: eventData.ticketTypes
          ? {
              deleteMany: {},
              create: eventData.ticketTypes,
            }
          : undefined,
        promotions: eventData.promotions
          ? {
              deleteMany: {}, // Delete existing promotions
              create: eventData.promotions.map((promo: any) => ({
                discount: promo.discount,
                startDate: new Date(promo.startDate),
                endDate: new Date(promo.endDate),
                maxUses: promo.maxUses,
                code: Math.random().toString(36).substring(2, 12).toUpperCase(),
              })),
            }
          : undefined,
      },
      include: {
        ticketTypes: true,
        promotions: true,
      },
    });
  }

  async softDeleteEvent(slug: string): Promise<any> {
    // Mark the event as deleted by setting `deletedAt`
    return await this.prisma.event.update({
      where: { slug: slug },
      data: {
        deletedAt: new Date(), // Set the current timestamp for the soft delete
      },
    });
  }

  async searchEvents(searchParams: any) {
    return await searchEvents(this.prisma, searchParams); // Use the helper function
  }

  // Organizer
  async getOrganizerEvents(organizerId: number) {
    const events = await this.prisma.event.findMany({
      where: { organizerId },
      select: {
        id: true,
        slug: true,
        name: true,
        startDate: true,
        location: true,
        category: true,
        availableSeats: true,
        deletedAt: true,
      },
    });

    return events.map((event) => ({
      id: event.id.toString(),
      slug: event.slug,
      title: event.name,
      date: event.startDate.toISOString(),
      location: event.location,
      category: event.category,
      capacity: event.availableSeats,
      deleteAt: event.deletedAt,
    }));
  }

  // Search only for organizer
  async searchOrganizerEvents(
    organizerId: number,
    name?: string,
    category?: EventCategory
  ) {
    const whereConditions: any = {
      organizerId,
      deletedAt: null,
    };

    if (name) {
      whereConditions.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (category) {
      whereConditions.category = category;
    }

    const events = await this.prisma.event.findMany({
      where: whereConditions,
      select: {
        id: true,
        slug: true,
        name: true,
        startDate: true,
        location: true,
        category: true,
        availableSeats: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return events.map((event) => ({
      id: event.id.toString(),
      slug: event.slug,
      title: event.name,
      date: event.startDate.toISOString(),
      location: event.location,
      category: event.category,
      capacity: event.availableSeats,
    }));
  }

  // Create Voucher for Event
  async createVoucherBySlug(
    slug: string,
    input: CreateVoucherInput
  ): Promise<Promotion> {
    const event = await this.prisma.event.findUnique({
      where: { slug: slug },
    });

    if (!event) throw new Error("Event not found");

    const code = Math.random().toString(36).substring(2, 12).toUpperCase();

    const voucher = await this.prisma.promotion.create({
      data: {
        eventId: event.id,
        discount: input.discount,
        startDate: new Date(),
        endDate: new Date(input.expiresAt),
        code: code,
        maxUses: input.maxUses,
      },
    });
    return voucher;
  }
}
