import { Request, Response } from "express";
import { TransactionService } from "../services/transactionService";
import { ImageService } from "../services/utilService";
import multer from "multer";

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
      pointsUsed = 0,
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

  async uploadPaymentProof(req: Request, res: Response) {
    try {
      ImageService.upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({
            error: `File upload error: ${err.message}`,
            code: "MULTER_ERROR",
          });
        }
        if (err) {
          return res.status(400).json({
            error: err.message,
            code: "UPLOAD_ERROR",
          });
        }
        if (!req.file) {
          return res.status(400).json({
            error: "No payment proof uploaded",
            code: "NO_FILE",
          });
        }

        try {
          const transactionId = parseInt(req.params.id);
          const updatedTransaction =
            await this.transactionService.uploadPaymentProof(
              transactionId,
              req.file
            );
          res.status(200).json({
            message: "Payment proof uploaded successfully",
            transaction: updatedTransaction,
          });
        } catch (err: any) {
          res.status(400).json({
            error: err.message || "Failed to upload payment proof",
            code: "TRANSACTION_ERROR",
          });
        }
      });
    } catch (err: any) {
      res.status(500).json({
        error: "Internal server error",
        code: "SERVER_ERROR",
      });
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

  // In TransactionController class
  async getTransactionsByOrganizerId(
    req: Request,
    res: Response
  ): Promise<void> {
    const organizerId = parseInt(req.params.organizerId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const transactions =
        await this.transactionService.getTransactionsByOrganizerId(
          organizerId,
          page,
          limit
        );
      res.send(transactions);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getUserTransactions(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.userId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const transactions = await this.transactionService.getUserTransactions(
        userId,
        page,
        limit
      );
      res.json(transactions);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getPendingTransactionsByOrganizerId(
    req: Request,
    res: Response
  ): Promise<void> {
    const organizerId = parseInt(req.params.organizerId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const pendingTransactions =
        await this.transactionService.getPendingTransactionsByOrganizerId(
          organizerId,
          page,
          limit
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
    const organizerId = parseInt(req.body.organizerId);
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
        organizerId
      );
      res.send(transaction);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
