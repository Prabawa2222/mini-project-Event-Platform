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

export interface BaseTransaction {
  id: number;
  event: string;
  ticketType: string;
  quantity: number;
  totalPrice: number;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
}

export enum TransactionStatus {
  PENDING = "PENDING",
  AWAITING_PAYMENT = "AWAITING_PAYMENT",
  PAID = "PAID",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
}

export interface TransactionPreview {
  id: number;
  user: { name: string };
  event: { name: string };
  ticketType: { name: string };
  coupon: string;
  promotion: string;
  quantity: number;
  totalPrice: number;
  status: string;
  paymentProof: string;
  createdAt: string;
  updatedAt: string;
  previewUrl?: string;
}

export interface TransactionDetails
  extends Omit<TransactionPreview, "coupon" | "promotion"> {
  coupon?: {
    code: string;
    discount: number;
  } | null;
  promotion?: {
    name: string;
    discount: number;
  } | null;
  expiresAt: Date;
  rejectionReason?: string;
  emailPreviewUrl?: string;
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

export interface EventSummary {
  totalTransactions: number;
  totalRevenue: number;
  ticketsSold: number;
}

export interface TransactionResponse {
  data: TransactionPreview[];
  total: number;
}

export interface PendingTransactionsResponse {
  data: TransactionPreview[];
  total: number;
  page: number;
  limit: number;
  length: number;
}

export interface UserTransaction {
  id: number;
  eventId: string;
  event: string;
  ticketType: string;
  quantity: number;
  totalPrice: number;
  status: string;
  paymentProof?: string | null;
  createdAt: string;
  updatedAt: string;
  transactionDate: string;
}

export interface UserTransactionPreview {
  data: UserTransaction[];
  total: number;
  page: number;
  limit: number;
}
