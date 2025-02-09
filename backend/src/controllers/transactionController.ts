import { Request, Response } from "express";
import { TransactionService } from "../services/transactionService";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  async createTransaction(req: Request, res: Response): Promise<void> {
    const {
      userId,
      eventId,
      ticketTypeId,
      quantity,
      pointsUsed,
      couponId,
      promotionId,
    } = req.body;
    try {
      const transaction = await this.transactionService.createTransaction({
        userId,
        eventId,
        ticketTypeId,
        quantity,
        pointsUsed,
        couponId,
        promotionId,
      });
      res.send(transaction);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAllTransaction(req: Request, res: Response): Promise<void> {
    try {
      const transaction = await this.transactionService.getAllTransaction();
      res.send(transaction);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getTransactionById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const transaction = await this.transactionService.getTransactionById(
        parseInt(id)
      );
      res.send(transaction);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async uploadPaymenProof(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { paymentProof } = req.body;
    try {
      const transaction = await this.transactionService.uploadPaymentProof(
        parseInt(id),
        paymentProof
      );
      res.send(transaction);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async updateStatuses(req: Request, res: Response): Promise<void> {
    try {
      await this.transactionService.expireTransaction();
      await this.transactionService.calcelOldTransaction();
      res.send({ message: "Transaction status updated successfully." });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async rollbackTransaction(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const result = await this.transactionService.rollbackTransaction(
        Number(id)
      );
      res.send(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getTransactionsByOrganizerId(
    req: Request,
    res: Response
  ): Promise<void> {
    const organizerId = parseInt(req.params.organizerId);

    try {
      const transactions =
        await this.transactionService.getTransactionsByOrganizerId(organizerId);
      res.send(transactions);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getPendingTransactionsByOrganizerId(
    req: Request,
    res: Response
  ): Promise<void> {
    const organizerId = parseInt(req.params.organizerId);

    try {
      const pendingTransactions =
        await this.transactionService.getPendingTransactionsByOrganizerId(
          organizerId
        );
      res.send(pendingTransactions);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getTransactionsSummaryByOrganizerId(
    req: Request,
    res: Response
  ): Promise<void> {
    const organizerId = parseInt(req.params.organizerId);

    try {
      const summary =
        await this.transactionService.getTransactionsSummaryByOrganizerId(
          organizerId
        );
      res.send(summary);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async approveTransaction(req: Request, res: Response): Promise<void> {
    const transactionId = parseInt(req.params.id);
    const organizerId = parseInt(req.body.organizerId); // Or get from auth token

    try {
      const transaction = await this.transactionService.approveTransaction(
        transactionId,
        organizerId
      );
      res.send(transaction);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async rejectTransaction(req: Request, res: Response): Promise<void> {
    const transactionId = parseInt(req.params.id);
    const organizerId = parseInt(req.body.organizerId); // Or get from auth token
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      res.status(400).json({ error: "Rejection reason is required" });
      return;
    }

    try {
      const transaction = await this.transactionService.rejectTransaction(
        transactionId,
        organizerId,
        rejectionReason
      );
      res.send(transaction);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
