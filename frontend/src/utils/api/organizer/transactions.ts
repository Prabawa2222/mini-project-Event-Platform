import {
  CreateTransactionDto,
  TransactionPreview,
  TransactionDetails,
  TransactionSummary,
  UploadPaymentProofDto,
  PendingTransactionsResponse,
} from "@/types/transaction";
import { fetchWithAuth } from "../auth";

export const transactionService = {
  async createTransaction(
    data: CreateTransactionDto
  ): Promise<TransactionDetails> {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_API}/api/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  async getTransactionsByOrganizerId(
    organizerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<TransactionPreview[]> {
    try {
      console.log(
        "Fetching transactions for organizer:",
        organizerId,
        "page:",
        page,
        "limit:",
        limit
      );

      const data = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API}/api/transaction/organizer/${organizerId}?page=${page}&limit=${limit}`
      );

      console.log("Received transactions:", data);
      return data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },

  async getPendingTransactionsByOrganizerId(
    organizerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PendingTransactionsResponse> {
    return fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API}/api/transaction/organizer/${organizerId}/pending?page=${page}&limit=${limit}`
    );
  },

  async getTransactionsSummaryByOrganizerId(
    organizerId: string
  ): Promise<TransactionSummary> {
    return fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API}/api/transaction/organizer/${organizerId}/summary`
    );
  },

  async getTransactionById(transactionId: number): Promise<TransactionDetails> {
    const url = `${process.env.NEXT_PUBLIC_API}/api/transaction/${transactionId}`;
    console.log("Fetching from URL:", url);

    try {
      const data = await fetchWithAuth(url);
      console.log("Parsed response data:", data);
      return data;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  },

  async approveTransaction(
    transactionId: number,
    organizerId: string
  ): Promise<TransactionDetails> {
    return fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API}/api/transaction/${transactionId}/approve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizerId }),
      }
    );
  },

  async rejectTransaction(
    transactionId: number,
    organizerId: string,
    rejectionReason: string
  ): Promise<TransactionDetails> {
    return fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API}/api/transaction/${transactionId}/reject`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizerId, rejectionReason }),
      }
    );
  },

  async getAllTransactions(): Promise<TransactionPreview[]> {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_API}/api/transaction`);
  },

  async rollbackTransaction(
    transactionId: number
  ): Promise<{ message: string }> {
    return fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API}/api/transaction/rollback/${transactionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },

  async updateStatuses(): Promise<{ message: string }> {
    return fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API}/api/transaction/update-statuses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
};
