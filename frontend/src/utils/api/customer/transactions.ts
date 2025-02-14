import {
  TransactionDetails,
  TransactionPreview,
  UploadPaymentProofDto,
  UserTransactionPreview,
} from "@/types/transaction";

export const transactionService = {
  async uploadPaymentProof(
    transactionId: number,
    data: UploadPaymentProofDto
  ): Promise<TransactionDetails> {
    const formData = new FormData();

    if (data.paymentProof) {
      formData.append("paymentProof", data.paymentProof);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/transaction/${transactionId}/payment-proof`,
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

  async getTransactionsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<UserTransactionPreview> {
    // Note: Return type is array now
    try {
      console.log(
        "Fetching transactions for userId:",
        userId,
        "page:",
        page,
        "limit:",
        limit
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/transaction/user/${userId}?page=${page}&limit=${limit}`,
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
};
