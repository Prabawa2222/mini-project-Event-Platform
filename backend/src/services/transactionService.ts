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
    const totalPrice = ticketType.price * quantity - pointsUsed;
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
}
