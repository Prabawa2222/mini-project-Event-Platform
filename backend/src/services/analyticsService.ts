import { PrismaClient, TransactionStatus } from "@prisma/client";

export class EventAnalyticsService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getOrganizerDashboardStats(organizerId: number, timeframe: string) {
    try {
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
        revenueStats,
        bestSellingEvents,
        upcomingEvents,
        recentTransactions,
      ] = await Promise.all([
        this.getTotalEvents(organizerId),
        this.getEventsByCategory(organizerId),
        this.getRevenueStats(organizerId, timeframe),
        this.getBestSellingEvents(organizerId),
        this.getUpcomingEvents(organizerId),
        this.getRecentTransactions(organizerId),
      ]);

      return {
        totalEvents,
        eventsByCategory,
        revenueStats,
        bestSellingEvents,
        upcomingEvents,
        recentTransactions,
      };
    } catch (error) {
      console.error("Error in getOrganizerDashboardStats:", error);
      throw error;
    }
  }

  private async getRevenueStats(organizerId: number, timeframe: string) {
    const today = new Date();
    let startDate = new Date();

    switch (timeframe) {
      case "daily":
        startDate.setDate(today.getDate() - 7);
        break;
      case "weekly":
        startDate.setDate(today.getDate() - 30);
        break;
      case "monthly":
        startDate.setMonth(today.getMonth() - 12);
        break;
      default:
        startDate.setMonth(today.getMonth() - 1);
    }

    const transactions = await this.prisma.transaction.findMany({
      where: {
        event: {
          organizerId,
        },
        status: TransactionStatus.DONE,
        createdAt: {
          gte: startDate,
          lte: today,
        },
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
    });

    const totalRevenue = transactions.reduce((sum, t) => sum + t.totalPrice, 0);
    const revenueTimeSeries = this.groupTransactionsByTimeframe(
      transactions,
      timeframe
    );

    return {
      totalRevenue,
      revenueTimeSeries,
    };
  }

  private async getRecentTransactions(organizerId: number) {
    return await this.prisma.transaction.findMany({
      where: {
        event: {
          organizerId,
        },
      },
      select: {
        id: true,
        totalPrice: true,
        createdAt: true,
        status: true,
        event: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });
  }

  private groupTransactionsByTimeframe(
    transactions: { totalPrice: number; createdAt: Date }[],
    timeframe: string
  ) {
    const groupedData = new Map<string, number>();

    transactions.forEach((transaction) => {
      let key: string;
      const date = new Date(transaction.createdAt);

      switch (timeframe) {
        case "daily":
          key = date.toISOString().split("T")[0];
          break;
        case "weekly":
          const weekNum = Math.ceil((date.getDate() + 6 - date.getDay()) / 7);
          key = `${date.getFullYear()}-W${weekNum}`;
          break;
        case "monthly":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
          break;
        default:
          key = date.toISOString().split("T")[0];
      }

      groupedData.set(
        key,
        (groupedData.get(key) || 0) + transaction.totalPrice
      );
    });

    return Array.from(groupedData.entries())
      .map(([period, amount]) => ({
        period,
        amount,
      }))
      .sort((a, b) => a.period.localeCompare(b.period));
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
    // First, get the event to determine the date range
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        startDate: true,
        endDate: true,
      },
    });

    if (!event) {
      throw new Error(`Event with ID ${eventId} not found`);
    }

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

    return this.groupSalesByTimeInterval(
      transactions,
      interval,
      event.startDate,
      event.endDate
    );
  }

  private groupSalesByTimeInterval(
    transactions: { createdAt: Date; totalPrice: number }[],
    interval: "daily" | "weekly" | "monthly",
    startDate: Date,
    endDate: Date
  ) {
    const salesMap = new Map<string, number>();

    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      let key: string;

      switch (interval) {
        case "daily":
          key = currentDate.toISOString().split("T")[0];
          break;
        case "weekly": {
          // Get the week number using ISO week date system
          const date = new Date(currentDate);
          const dayNum = date.getUTCDay() || 7;
          date.setUTCDate(date.getUTCDate() + 4 - dayNum);
          const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
          const weekNum = Math.ceil(
            ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
          );
          key = `${currentDate.getFullYear()}-W${String(weekNum).padStart(
            2,
            "0"
          )}`;
          break;
        }
        case "monthly":
          key = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1
          ).padStart(2, "0")}`;
          break;
      }

      salesMap.set(key, 0); // Initialize period with 0 sales

      // Increment date based on interval
      switch (interval) {
        case "daily":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "weekly":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }

    transactions.forEach((transaction) => {
      let key: string;
      const date = new Date(transaction.createdAt);

      switch (interval) {
        case "daily":
          key = date.toISOString().split("T")[0];
          break;
        case "weekly": {
          const dayNum = date.getUTCDay() || 7;
          date.setUTCDate(date.getUTCDate() + 4 - dayNum);
          const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
          const weekNum = Math.ceil(
            ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
          );
          key = `${date.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
          break;
        }
        case "monthly":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
          break;
      }

      if (salesMap.has(key)) {
        salesMap.set(key, (salesMap.get(key) || 0) + transaction.totalPrice);
      }
    });

    return Array.from(salesMap.entries())
      .map(([period, amount]) => ({
        period,
        amount,
      }))
      .sort((a, b) => a.period.localeCompare(b.period));
  }
}
