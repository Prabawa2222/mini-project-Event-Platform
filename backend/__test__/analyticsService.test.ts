import { PrismaClient, TransactionStatus } from "@prisma/client";
import { EventAnalyticsService } from "../src/services/analyticsService";

// Mock PrismaClient
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(),
  TransactionStatus: {
    DONE: "DONE",
    PENDING: "PENDING",
    FAILED: "FAILED",
  },
}));

describe("EventAnalyticsService", () => {
  let eventAnalyticsService: EventAnalyticsService;
  let mockPrisma: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock Prisma client
    mockPrisma = {
      event: {
        findUnique: jest.fn(),
        count: jest.fn(),
        groupBy: jest.fn(),
        findMany: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      transaction: {
        aggregate: jest.fn(),
        groupBy: jest.fn(),
        findMany: jest.fn(),
      },
      review: {
        aggregate: jest.fn(),
      },
    };

    (PrismaClient as jest.Mock).mockImplementation(() => mockPrisma);
    eventAnalyticsService = new EventAnalyticsService();
  });

  describe("getEventAnalytics", () => {
    it("should return event analytics successfully", async () => {
      // Mock event exists
      mockPrisma.event.findUnique.mockResolvedValue({ id: 1 });

      // Mock analytics data
      mockPrisma.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { totalPrice: 1000 } }) // getTotalSales
        .mockResolvedValueOnce({ _sum: { quantity: 5 } }); // getTicketsSold

      mockPrisma.review.aggregate.mockResolvedValue({ _avg: { rating: 4.5 } });

      mockPrisma.transaction.groupBy
        .mockResolvedValueOnce([
          { ticketTypeId: 1, _sum: { quantity: 3, totalPrice: 600 } },
          { ticketTypeId: 2, _sum: { quantity: 2, totalPrice: 400 } },
        ]) // getSalesByTicketType
        .mockResolvedValueOnce([
          { status: "DONE", _count: 5 },
          { status: "PENDING", _count: 2 },
        ]); // getTransactionStatuses

      const result = await eventAnalyticsService.getEventAnalytics(1);

      expect(result).toEqual({
        totalSales: 1000,
        ticketsSold: 5,
        averageRating: 4.5,
        salesByTicketType: [
          { ticketTypeId: 1, _sum: { quantity: 3, totalPrice: 600 } },
          { ticketTypeId: 2, _sum: { quantity: 2, totalPrice: 400 } },
        ],
        transactionsStatuses: [
          { status: "DONE", _count: 5 },
          { status: "PENDING", _count: 2 },
        ],
      });
    });

    it("should throw error if event not found", async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null);

      await expect(
        eventAnalyticsService.getEventAnalytics(999)
      ).rejects.toThrow("Event with ID 999 not found");
    });
  });

  describe("getOrganizerAnalytics", () => {
    it("should return organizer analytics successfully", async () => {
      // Mock organizer exists
      mockPrisma.user.findUnique.mockResolvedValue({ id: 1 });

      // Mock analytics data
      mockPrisma.event.count.mockResolvedValue(3);
      mockPrisma.event.groupBy.mockResolvedValue([
        { category: "MUSIC", _count: 2 },
        { category: "SPORTS", _count: 1 },
      ]);
      mockPrisma.transaction.aggregate.mockResolvedValue({
        _sum: { totalPrice: 2000 },
      });

      mockPrisma.event.findMany
        .mockResolvedValueOnce([
          { name: "Event 1", _count: { transactions: 10 } },
          { name: "Event 2", _count: { transactions: 5 } },
        ]) // getBestSellingEvents
        .mockResolvedValueOnce([
          {
            name: "Upcoming Event 1",
            startDate: new Date("2025-12-31"),
            availableSeats: 100,
            _count: { transactions: 20 },
          },
        ]); // getUpcomingEvents

      const result = await eventAnalyticsService.getOrganizerAnalytics(1);

      expect(result).toEqual({
        totalEvents: 3,
        eventsByCategory: [
          { category: "MUSIC", _count: 2 },
          { category: "SPORTS", _count: 1 },
        ],
        totalRevenue: 2000,
        bestSellingEvents: [
          { name: "Event 1", salesCount: 10 },
          { name: "Event 2", salesCount: 5 },
        ],
        upcomingEvents: [
          {
            name: "Upcoming Event 1",
            startDate: expect.any(Date),
            availableSeats: 100,
            _count: { transactions: 20 },
          },
        ],
      });
    });

    it("should throw error if organizer not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        eventAnalyticsService.getOrganizerAnalytics(999)
      ).rejects.toThrow("Organizer with ID 999 not found");
    });
  });

  describe("getSalesOverTime", () => {
    it("should return daily sales data correctly", async () => {
      const mockTransactions = [
        { createdAt: new Date("2025-01-01"), totalPrice: 100 },
        { createdAt: new Date("2025-01-01"), totalPrice: 200 },
        { createdAt: new Date("2025-01-02"), totalPrice: 300 },
      ];

      mockPrisma.transaction.findMany.mockResolvedValue(mockTransactions);

      const result = await eventAnalyticsService.getSalesOverTime(1, "daily");

      expect(result).toEqual([
        { period: "2025-01-01", amount: 300 },
        { period: "2025-01-02", amount: 300 },
      ]);
    });

    it("should return monthly sales data correctly", async () => {
      const mockTransactions = [
        { createdAt: new Date("2025-01-15"), totalPrice: 100 },
        { createdAt: new Date("2025-01-20"), totalPrice: 200 },
        { createdAt: new Date("2025-02-01"), totalPrice: 300 },
      ];

      mockPrisma.transaction.findMany.mockResolvedValue(mockTransactions);

      const result = await eventAnalyticsService.getSalesOverTime(1, "monthly");

      expect(result).toEqual([
        { period: "2025-01", amount: 300 },
        { period: "2025-02", amount: 300 },
      ]);
    });
  });
});
