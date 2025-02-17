import {
  PointsType,
  PrismaClient,
  Transaction,
  TransactionStatus,
} from "@prisma/client";
import { TransactionRequest, TransactionWithImage } from "../types";
import { ImageService } from "./utilService";
import { EmailService } from "./emailService";
export class TransactionService {
  private prisma: PrismaClient;
  private imageService: ImageService;
  private emailService: EmailService;

  constructor() {
    this.prisma = new PrismaClient();
    this.imageService = new ImageService();
    this.emailService = new EmailService();
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

    // Start a transaction to ensure both operations succeed or fail together
    return await this.prisma.$transaction(async (prisma) => {
      // Check user's points balance
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new Error("User not found");
      if (user.points < pointsUsed) throw new Error("Insufficient points");

      const ticketType = await prisma.ticketType.findUnique({
        where: { id: ticketTypeId },
      });
      if (!ticketType || ticketType.quantity < quantity)
        throw new Error("Not enough tickets available");

      let promotionData = null;

      // Calculate initial total price
      let totalPrice = ticketType.price * quantity - pointsUsed;

      // Update ticket quantity before creating transaction:
      await prisma.ticketType.update({
        where: { id: ticketTypeId },
        data: {
          quantity: { decrement: quantity },
        },
      });
      // Apply promotion discount if a valid promotionId is provided
      if (promotionId) {
        const promotion = await prisma.promotion.findUnique({
          where: { code: promotionId },
        });

        if (
          promotion &&
          promotion.eventId === eventId &&
          new Date() <= promotion.endDate &&
          (promotion.maxUses === null ||
            promotion.currentUses < promotion.maxUses)
        ) {
          // Update the currentUses counter
          await prisma.promotion.update({
            where: { id: promotion.id },
            data: { currentUses: { increment: 1 } },
          });

          const discountAmount = (promotion.discount / 100) * totalPrice;
          totalPrice -= discountAmount;
          promotionData = promotion; // Store the promotion data
        } else {
          throw new Error("Invalid, expired, or fully used promotion");
        }
      }

      // Create the transaction
      const transaction = await prisma.transaction.create({
        data: {
          userId,
          eventId,
          ticketTypeId,
          quantity,
          pointsUsed,
          couponId,
          promotionId: promotionData?.id,
          totalPrice,
          status: "WAITING_FOR_PAYMENT",
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        },
      });

      // Deduct points from user
      if (pointsUsed > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { points: { decrement: pointsUsed } },
        });

        // Create points history record
        await prisma.pointsHistory.create({
          data: {
            userId,
            points: -pointsUsed,
            type: "USED",
            expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          },
        });
      }

      return transaction;
    });
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

  async uploadPaymentProof(transactionId: number, file: Express.Multer.File) {
    return await this.prisma.$transaction(async (prisma) => {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      if (transaction.status !== "WAITING_FOR_PAYMENT") {
        throw new Error("Transaction is not in waiting for payment status");
      }

      if (transaction.expiresAt < new Date()) {
        throw new Error("Transaction has expired");
      }

      try {
        const imageService = new ImageService();
        const paymentProofUrl = await imageService.uploadImage(file);

        const updatedTransaction = await prisma.transaction.update({
          where: { id: transactionId },
          data: {
            paymentProof: paymentProofUrl,
            status: "WAITING_FOR_ADMIN_CONFIRMATION",
            updatedAt: new Date(),
          },
        });

        return updatedTransaction;
      } catch (error: any) {
        throw new Error(`Failed to upload payment proof: ${error.message}`);
      }
    });
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

  async getUserTransactions(
    userId: number,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const skip = (page - 1) * limit;

      const [transactions, total] = await Promise.all([
        this.prisma.transaction.findMany({
          where: {
            userId: userId,
          },
          include: {
            event: {
              select: {
                name: true,
                startDate: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: limit,
        }),
        this.prisma.transaction.count({
          where: {
            userId: userId,
          },
        }),
      ]);

      const formattedTransactions = transactions.map((transaction) => ({
        id: transaction.id,
        event: transaction.event.name,
        transactionDate: transaction.createdAt,
        status: transaction.status,
        totalPrice: transaction.totalPrice,
      }));

      return {
        data: formattedTransactions,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      throw new Error("Failed to fetch user transactions");
    }
  }

  //organizer service
  async getTransactionsByOrganizerId(
    organizerId: number,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const skip = (page - 1) * limit;

      const [transactions, total] = await Promise.all([
        this.prisma.transaction.findMany({
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
          skip,
          take: limit,
        }),
        this.prisma.transaction.count({
          where: {
            event: {
              organizerId: organizerId,
            },
          },
        }),
      ]);

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

  async getPendingTransactionsByOrganizerId(
    organizerId: number,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const skip = (page - 1) * limit;

      const [pendingTransactions, total] = await Promise.all([
        this.prisma.transaction.findMany({
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
          skip,
          take: limit,
        }),
        this.prisma.transaction.count({
          where: {
            event: {
              organizerId: organizerId,
            },
            status: "WAITING_FOR_PAYMENT",
          },
        }),
      ]);

      const transformedTransactions = pendingTransactions.map(
        (transaction) => ({
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
        })
      );

      return {
        data: transformedTransactions,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
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

  async approveTransaction(
    transactionId: number,
    organizerId: number
  ): Promise<Transaction> {
    return await this.prisma.$transaction(async (prisma) => {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          user: true,
          event: true,
          ticketType: true,
        },
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      if (transaction.event.organizerId !== organizerId) {
        throw new Error("Unauthorized to approve this transaction");
      }

      const updatedTransaction = await this.prisma.transaction.update({
        where: { id: transactionId },
        data: {
          status: "DONE",
          updatedAt: new Date(),
        },
      });

      await this.emailService.sendTransactionApprovalEmail(
        transaction.user.email,
        {
          eventName: transaction.event.name,
          ticketType: transaction.ticketType.name,
          quantity: transaction.quantity,
          totalPrice: transaction.totalPrice,
        }
      );

      return updatedTransaction;
    });
  }

  async rejectTransaction(
    transactionId: number,
    organizerId: number,
    rejectionReason: string
  ): Promise<Transaction> {
    return await this.prisma.$transaction(async (prisma) => {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          user: true,
          event: true,
          ticketType: true,
        },
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      if (transaction.event.organizerId !== organizerId) {
        throw new Error("Unauthorized to reject this transaction");
      }

      // Restore resources
      await Promise.all([
        // Restore seats
        prisma.ticketType.update({
          where: { id: transaction.ticketTypeId },
          data: {
            quantity: {
              increment: transaction.quantity,
            },
          },
        }),

        // Return points if used
        transaction.pointsUsed > 0 &&
          prisma.user.update({
            where: { id: transaction.userId },
            data: {
              points: {
                increment: transaction.pointsUsed,
              },
            },
          }),

        // Return coupon if used
        transaction.couponId &&
          prisma.coupon.update({
            where: { id: transaction.couponId },
            data: {
              isUsed: false,
              usedAt: null,
            },
          }),

        // Decrement promotion usage if used
        transaction.promotionId &&
          prisma.promotion.update({
            where: { id: transaction.promotionId },
            data: {
              currentUses: {
                decrement: 1,
              },
            },
          }),
      ]);

      const updatedTransaction = await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          status: "REJECTED",
        },
        include: { user: true },
      });

      // Send rejection email
      await this.emailService.sendTransactionRejectionEmail(
        transaction.user.email,
        {
          eventName: transaction.event.name,
          ticketType: transaction.ticketType.name,
          quantity: transaction.quantity,
          totalPrice: transaction.totalPrice,
        },
        rejectionReason
      );

      return updatedTransaction;
    });
  }
}
