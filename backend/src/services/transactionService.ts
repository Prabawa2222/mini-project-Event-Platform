import { PrismaClient, TransactionStatus } from "@prisma/client";
import { TransactionRequest } from "../types";
export class TransactionService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createTransaction(data: TransactionRequest) {
    const {
      userId,
      eventId,
      ticketTypeId,
      quantity,
      pointsUsed,
      couponId,
      promotionId,
    } = data;

    const ticketType = await this.prisma.ticketType.findUnique({
      where: { id: ticketTypeId },
    });
    if (!ticketType || ticketType.quantity < quantity)
      throw new Error("Not enough tickets available");

    // Calculate initial total price
    let totalPrice = ticketType.price * quantity - pointsUsed;

    // Apply promotion discount if a valid promotionId is provided
    if (promotionId) {
      const promotion = await this.prisma.promotion.findUnique({
        where: { id: promotionId },
      });

      if (
        promotion &&
        promotion.eventId === eventId &&
        new Date() <= promotion.endDate
      ) {
        const discountAmount = (promotion.discount / 100) * totalPrice;
        totalPrice -= discountAmount;
      } else {
        throw new Error("Invalid or expired promotion");
      }
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        eventId,
        ticketTypeId,
        quantity,
        pointsUsed,
        couponId,
        promotionId,
        totalPrice,
        status: "WAITING_FOR_PAYMENT",
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
    });

    await this.prisma.ticketType.update({
      where: { id: ticketTypeId },
      data: {
        quantity: ticketType.quantity - quantity,
      },
    });

    return transaction;
  }

  async getAllTransaction() {
    try {
      const transactions = await this.prisma.transaction.findMany({
        include: {
          user: {
            select: {
              name: true,
            },
          },
          event: {
            select: {
              name: true,
            },
          },
          ticketType: {
            select: {
              name: true,
            },
          },
        },
      });
      return transactions.map((transactions) => ({
        id: transactions.id,
        user: transactions.user.name,
        event: transactions.event.name,
        ticketType: transactions.ticketType.name,
        status: transactions.status,
      }));
    } catch (error) {
      console.error("Error fetching transaction:", error);
      throw new Error("Failed to fetch transaction");
    }
  }

  async getTransactionById(transactionId: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        user: true,
        event: true,
        ticketType: true,
        coupon: true,
        promotion: true,
      },
    });
    if (!transaction) throw new Error("Transaction not found");

    return {
      user: transaction.user.name,
      event: transaction.event.name,
      ticketType: transaction.ticketType.name,
      quantity: transaction.quantity,
      status: transaction.status,
      paymentProof: transaction.paymentProof,
      coupon: transaction.coupon,
      promotion: transaction.promotion,
      totalPrice: transaction.totalPrice,
      createdAt: transaction.createdAt,
      expiresAt: transaction.expiresAt,
      updatedAt: transaction.updatedAt,
    };
  }

  async uploadPaymentProof(transactionId: number, paymentProof: string) {
    const transaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { paymentProof, status: "WAITING_FOR_ADMIN_CONFIRMATION" },
    });

    return transaction;
  }

  async expireTransaction() {
    const now = new Date();
    try {
      await this.prisma.transaction.updateMany({
        where: {
          status: "WAITING_FOR_PAYMENT",
          expiresAt: { lte: now },
        },
        data: { status: "EXPIRED" },
      });
    } catch (error) {
      console.error("Error expiring transaction:", error);
    }
  }

  async calcelOldTransaction() {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    try {
      await this.prisma.transaction.updateMany({
        where: {
          status: "WAITING_FOR_ADMIN_CONFIRMATION",
          updatedAt: { lte: threeDaysAgo },
        },
        data: { status: "CANCELED" },
      });
    } catch (error) {
      console.error("Error expiring transaction:", error);
    }
  }

  async rollbackTransaction(transactionId: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    // Ensure the status is either EXPIRED or CANCELED
    if (!transaction || transaction.status !== TransactionStatus.EXPIRED) {
      throw new Error("Invalid transaction for rollback");
    }

    // Restore points
    await this.prisma.user.update({
      where: { id: transaction.userId },
      data: { points: { increment: transaction.pointsUsed } },
    });

    // Restore ticket quantity
    await this.prisma.ticketType.update({
      where: { id: transaction.ticketTypeId },
      data: { quantity: { increment: transaction.quantity } },
    });

    return { message: "Rollback Successful" };
  }

  //organizer service
  async getTransactionsByOrganizerId(organizerId: number) {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          event: {
            organizerId: organizerId,
          },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          event: {
            select: {
              name: true,
              startDate: true,
            },
          },
          ticketType: {
            select: {
              name: true,
              price: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return transactions.map((transaction) => ({
        id: transaction.id,
        user: {
          name: transaction.user.name,
          email: transaction.user.email,
        },
        event: {
          name: transaction.event.name,
          startDate: transaction.event.startDate,
        },
        ticketType: {
          name: transaction.ticketType.name,
          price: transaction.ticketType.price,
        },
        quantity: transaction.quantity,
        totalPrice: transaction.totalPrice,
        status: transaction.status,
        createdAt: transaction.createdAt,
        paymentProof: transaction.paymentProof,
      }));
    } catch (error) {
      console.error("Error fetching organizer transactions:", error);
      throw new Error("Failed to fetch organizer transactions");
    }
  }

  async getPendingTransactionsByOrganizerId(organizerId: number) {
    try {
      const pendingTransactions = await this.prisma.transaction.findMany({
        where: {
          event: {
            organizerId: organizerId,
          },
          status: "WAITING_FOR_PAYMENT",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          event: {
            select: {
              name: true,
            },
          },
          ticketType: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          updatedAt: "asc",
        },
      });

      return pendingTransactions.map((transaction) => ({
        id: transaction.id,
        user: {
          name: transaction.user.name,
          email: transaction.user.email,
        },
        event: transaction.event.name,
        ticketType: transaction.ticketType.name,
        quantity: transaction.quantity,
        totalPrice: transaction.totalPrice,
        paymentProof: transaction.paymentProof,
        updatedAt: transaction.updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching pending transactions:", error);
      throw new Error("Failed to fetch pending transactions");
    }
  }

  async getTransactionsSummaryByOrganizerId(organizerId: number) {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          event: {
            organizerId: organizerId,
          },
          status: "DONE",
        },
        include: {
          event: {
            select: {
              name: true,
            },
          },
        },
      });

      const eventSummaries = transactions.reduce((acc, transaction) => {
        const eventName = transaction.event.name;
        if (!acc[eventName]) {
          acc[eventName] = {
            totalTransactions: 0,
            totalRevenue: 0,
            ticketsSold: 0,
          };
        }

        acc[eventName].totalTransactions++;
        acc[eventName].totalRevenue += transaction.totalPrice;
        acc[eventName].ticketsSold += transaction.quantity;

        return acc;
      }, {} as Record<string, { totalTransactions: number; totalRevenue: number; ticketsSold: number }>);

      const overallSummary = {
        totalEvents: Object.keys(eventSummaries).length,
        totalTransactions: transactions.length,
        totalRevenue: transactions.reduce((sum, t) => sum + t.totalPrice, 0),
        totalTicketsSold: transactions.reduce((sum, t) => sum + t.quantity, 0),
      };

      return {
        overallSummary,
        eventSummaries,
      };
    } catch (error) {
      console.error("Error generating transactions summary:", error);
      throw new Error("Failed to generate transactions summary");
    }
  }

  async approveTransaction(transactionId: number, organizerId: number) {
    try {
      const transaction = await this.prisma.transaction.findFirst({
        where: {
          id: transactionId,
          event: {
            organizerId: organizerId,
          },
          status: "WAITING_FOR_ADMIN_CONFIRMATION",
        },
      });

      if (!transaction) {
        throw new Error("Transaction not found or not authorized");
      }

      const updatedTransaction = await this.prisma.transaction.update({
        where: { id: transactionId },
        data: {
          status: "DONE",
          updatedAt: new Date(),
        },
      });

      return updatedTransaction;
    } catch (error) {
      console.error("Error approving transaction:", error);
      throw new Error("Failed to approve transaction");
    }
  }

  async rejectTransaction(
    transactionId: number,
    organizerId: number,
    rejectionReason: string
  ) {
    try {
      const transaction = await this.prisma.transaction.findFirst({
        where: {
          id: transactionId,
          event: {
            organizerId: organizerId,
          },
          status: "WAITING_FOR_ADMIN_CONFIRMATION",
        },
      });

      if (!transaction) {
        throw new Error("Transaction not found or not authorized");
      }

      // Update transaction status to REJECTED
      const updatedTransaction = await this.prisma.transaction.update({
        where: { id: transactionId },
        data: {
          status: "REJECTED",
          updatedAt: new Date(),
        },
      });

      await this.prisma.ticketType.update({
        where: { id: transaction.ticketTypeId },
        data: {
          quantity: { increment: transaction.quantity },
        },
      });

      if (transaction.pointsUsed > 0) {
        await this.prisma.user.update({
          where: { id: transaction.userId },
          data: {
            points: { increment: transaction.pointsUsed },
          },
        });
      }

      return updatedTransaction;
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      throw new Error("Failed to reject transaction");
    }
  }
}
