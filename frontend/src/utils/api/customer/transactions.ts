import { getSession } from "next-auth/react";

import {
  TransactionDetails,
  TransactionPreview,
  UploadPaymentProofDto,
  UserTransactionPreview,
} from "@/types/transaction";
import { fetchWithAuth } from "../auth";

export const transactionService = {
  async uploadPaymentProof(
    transactionId: number,
    data: UploadPaymentProofDto
  ): Promise<TransactionDetails> {
    const session = await getSession();
    if (!session?.user?.accessToken) {
      throw new Error("No authentication token available");
    }

    const formData = new FormData();

    if (data.paymentProof) {
      formData.append("paymentProof", data.paymentProof);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/transaction/${transactionId}/payment-proof`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
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
    try {
      console.log(
        "Fetching transactions for userId:",
        userId,
        "page:",
        page,
        "limit:",
        limit
      );

      const data = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API}/api/transaction/user/${userId}?page=${page}&limit=${limit}`
      );

      console.log("Received transactions:", data);
      return data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },
};
