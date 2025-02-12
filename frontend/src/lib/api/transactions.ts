import {
  CreateTransactionDto,
  TransactionPreview,
  TransactionDetails,
  TransactionSummary,
  UploadPaymentProofDto,
} from "@/types/transaction";

export const transactionService = {
  async createTransaction(
    data: CreateTransactionDto
  ): Promise<TransactionDetails> {
    const response = await fetch(`${process.env.BASE_URL}/api/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error(`Failed to create transaction: ${errorText}`);
    }
    return response.json();
  },

  async uploadPaymentProof(
    transactionId: number,
    data: UploadPaymentProofDto
  ): Promise<TransactionDetails> {
    const formData = new FormData();

    if (data.paymentProof) {
      formData.append("paymentProof", data.paymentProof);
    }

    const response = await fetch(
      `${process.env.BASE_URL}/api/transaction/${transactionId}/payment-proof`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload payment proof");
    }
    return response.json();
  },

  async getTransactionsByOrganizerId(
    organizerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<TransactionPreview[]> {
    // Note: Return type is array now
    try {
      console.log(
        "Fetching transactions for organizer:",
        organizerId,
        "page:",
        page,
        "limit:",
        limit
      );

      const response = await fetch(
        `${process.env.BASE_URL}/api/transaction/organizer/${organizerId}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      console.log("Received transactions:", data);
      return data; // Return the array directly
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },

  async getPendingTransactionsByOrganizerId(
    organizerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<TransactionPreview[]> {
    const response = await fetch(
      `${process.env.BASE_URL}/api/transaction/organizer/${organizerId}/pending?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch pending transactions");
    }
    return response.json();
  },

  async getTransactionsSummaryByOrganizerId(
    organizerId: string
  ): Promise<TransactionSummary> {
    const response = await fetch(
      `${process.env.BASE_URL}/api/transaction/organizer/${organizerId}/summary`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch transactions summary");
    }
    return response.json();
  },

  async getTransactionById(transactionId: number): Promise<TransactionDetails> {
    const url = `${process.env.BASE_URL}/api/transaction/${transactionId}`;
    console.log("Fetching from URL:", url);

    try {
      const response = await fetch(url);
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to fetch transaction details: ${errorText}`);
      }

      const data = await response.json();
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
    const response = await fetch(
      `${process.env.BASE_URL}/api/transaction/${transactionId}/approve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizerId }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to approve transaction");
    }
    return response.json();
  },

  async rejectTransaction(
    transactionId: number,
    organizerId: string,
    rejectionReason: string
  ): Promise<TransactionDetails> {
    const response = await fetch(
      `${process.env.BASE_URL}/api/transaction/${transactionId}/reject`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizerId, rejectionReason }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to reject transaction");
    }
    return response.json();
  },

  async getAllTransactions(): Promise<TransactionPreview[]> {
    const response = await fetch(`${process.env.BASE_URL}/api/transaction`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch all transactions");
    }
    return response.json();
  },

  async rollbackTransaction(
    transactionId: number
  ): Promise<{ message: string }> {
    const response = await fetch(
      `${process.env.BASE_URL}/api/transaction/rollback/${transactionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to rollback transaction");
    }
    return response.json();
  },

  async updateStatuses(): Promise<{ message: string }> {
    const response = await fetch(
      `${process.env.BASE_URL}/api/transaction/update-statuses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update transaction statuses");
    }
    return response.json();
  },
};
