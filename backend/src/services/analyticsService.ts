import { PrismaClient, TransactionStatus } from "@prisma/client";

export class EventAnalyticsService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getEventAnalytics(eventId: number) {
    try {
      // Validate event exists
      const eventExists = await this.prisma.event.findUnique({
        where: { id: eventId },
        select: { id: true },
      });

      if (!eventExists) {
        throw new Error(`Event with ID ${eventId} not found`);
      }

      const [
        totalSales,
        ticketsSold,
        averageRating,
        salesByTicketType,
        transactionsStatuses,
      ] = await Promise.all([
        this.getTotalSales(eventId),
        this.getTicketsSold(eventId),
        this.getAverageRating(eventId),
        this.getSalesByTicketType(eventId),
        this.getTransactionStatuses(eventId),
      ]);

      return {
        totalSales,
        ticketsSold,
        averageRating,
        salesByTicketType,
        transactionsStatuses,
      };
    } catch (error) {
      console.error("Error in getEventAnalytics:", error);
      throw error;
    }
  }

  async getOrganizerAnalytics(organizerId: number) {
    try {
      // Validate organizer exists
      const organizerExists = await this.prisma.user.findUnique({
        where: { id: organizerId },
        select: { id: true },
      });

      if (!organizerExists) {
        throw new Error(`Organizer with ID ${organizerId} not found`);
      }

      const [
        totalEvents,
        eventsByCategory,
        totalRevenue,
        bestSellingEvents,
        upcomingEvents,
      ] = await Promise.all([
        this.getTotalEvents(organizerId),
        this.getEventsByCategory(organizerId),
        this.getTotalRevenue(organizerId),
        this.getBestSellingEvents(organizerId),
        this.getUpcomingEvents(organizerId),
      ]);

      return {
        totalEvents,
        eventsByCategory,
        totalRevenue,
        bestSellingEvents,
        upcomingEvents,
      };
    } catch (error) {
      console.error("Error in getOrganizerAnalytics:", error);
      throw error;
    }
  }

  private async getTotalSales(eventId: number): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        eventId,
        status: TransactionStatus.DONE,
      },
      _sum: {
        totalPrice: true,
      },
    });
    return result._sum.totalPrice || 0;
  }

  private async getTicketsSold(eventId: number): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        eventId,
        status: TransactionStatus.DONE,
      },
      _sum: {
        quantity: true,
      },
    });
    return result._sum.quantity || 0;
  }

  private async getAverageRating(eventId: number): Promise<number> {
    const result = await this.prisma.review.aggregate({
      where: {
        eventId,
      },
      _avg: {
        rating: true,
      },
    });
    return result._avg.rating || 0;
  }

  private async getSalesByTicketType(eventId: number) {
    return await this.prisma.transaction.groupBy({
      by: ["ticketTypeId"],
      where: {
        eventId,
        status: TransactionStatus.DONE,
      },
      _sum: {
        quantity: true,
        totalPrice: true,
      },
    });
  }

  private async getTransactionStatuses(eventId: number) {
    return await this.prisma.transaction.groupBy({
      by: ["status"],
      where: {
        eventId,
      },
      _count: true,
    });
  }

  private async getTotalEvents(organizerId: number): Promise<number> {
    return await this.prisma.event.count({
      where: {
        organizerId,
        deletedAt: null,
      },
    });
  }

  private async getEventsByCategory(organizerId: number) {
    return await this.prisma.event.groupBy({
      by: ["category"],
      where: {
        organizerId,
        deletedAt: null,
      },
      _count: true,
    });
  }

  private async getTotalRevenue(organizerId: number): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        event: {
          organizerId,
        },
        status: TransactionStatus.DONE,
      },
      _sum: {
        totalPrice: true,
      },
    });
    return result._sum.totalPrice || 0;
  }

  private async getBestSellingEvents(organizerId: number) {
    const events = await this.prisma.event.findMany({
      where: {
        organizerId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            transactions: {
              where: {
                status: TransactionStatus.DONE,
              },
            },
          },
        },
      },
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      take: 5,
    });

    return events.map((event) => ({
      name: event.name,
      salesCount: event._count.transactions,
    }));
  }

  private async getUpcomingEvents(organizerId: number) {
    return await this.prisma.event.findMany({
      where: {
        organizerId,
        startDate: {
          gt: new Date(),
        },
        deletedAt: null,
      },
      select: {
        name: true,
        startDate: true,
        availableSeats: true,
        _count: {
          select: {
            transactions: {
              where: {
                status: TransactionStatus.DONE,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
      take: 5,
    });
  }

  async getSalesOverTime(
    eventId: number,
    interval: "daily" | "weekly" | "monthly"
  ) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        eventId,
        status: TransactionStatus.DONE,
      },
      select: {
        createdAt: true,
        totalPrice: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return this.groupSalesByTimeInterval(transactions, interval);
  }

  private groupSalesByTimeInterval(
    transactions: { createdAt: Date; totalPrice: number }[],
    interval: "daily" | "weekly" | "monthly"
  ) {
    const salesMap = new Map<string, number>();

    transactions.forEach((transaction) => {
      let key: string;
      const date = new Date(transaction.createdAt);

      switch (interval) {
        case "daily":
          key = date.toISOString().split("T")[0];
          break;
        case "weekly":
          const week = Math.floor(date.getDate() / 7);
          key = `${date.getFullYear()}-W${week}`;
          break;
        case "monthly":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
          break;
      }

      salesMap.set(key, (salesMap.get(key) || 0) + transaction.totalPrice);
    });

    return Array.from(salesMap.entries()).map(([period, amount]) => ({
      period,
      amount,
    }));
  }
}
