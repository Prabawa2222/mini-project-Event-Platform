export interface CreateTransactionDto {
  userId: number;
  eventId: number;
  ticketTypeId: number;
  quantity: number;
  pointsUsed?: number;
  couponId?: number;
  promotionId?: number;
}

export interface UploadPaymentProofDto {
  paymentProof: File;
}

export interface TransactionPreview {
  id: number;
  user: string;
  coupon: string | null;
  promotion: string | null;
  event: string;
  ticketType: string;
  quantity: number;
  totalPrice: number;
  status: string;
  paymentProof: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionDetails extends TransactionPreview {
  coupon?: {
    code: string;
    discount: number;
  };
  promotion?: {
    name: string;
    discount: number;
  };
  expiresAt: Date;
  rejectionReason?: string;
}

export interface TransactionSummary {
  overallSummary: {
    totalEvents: number;
    totalTransactions: number;
    totalRevenue: number;
    totalTicketsSold: number;
  };
  eventSummaries: Record<
    string,
    {
      totalTransactions: number;
      totalRevenue: number;
      ticketsSold: number;
    }
  >;
}
