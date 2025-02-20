import { EventCategory, UserRole } from "@prisma/client";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: UserRole;
      };
    }
  }
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  referralCode?: string;
  role: UserRole;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  referralCode: string;
  points: number;
  profilePicture?: string | null;
}

export interface GetProfileUserResponse {
  id: number;
  email: string;
  name: string;
  points: number;
  profilePicture?: string | null;
  referralCode: string;
  activeCoupons: string;
}

export interface GetProfileOrganizerResponse {
  id: number;
  email: string;
  name: string;
  profilePicture?: string | null;
}

export interface CreateEventDto {
  name: string;
  description: string;
  price: number;
  startDate: Date;
  endDate: Date;
  availableSeats: number;
  category?: EventCategory;
  location: string;
  ticketTypes: {
    name: string;
    price: number;
    quantity: number;
    description?: string;
  };
}

export interface EventPreview {
  name: string;
  description: string;
  price: number;
  startDate: Date;
  category?: EventCategory;
  location: string;
  deleteAt?: Date;
}

export interface UpdateEventDTO {
  name?: string;
  description?: string;
  price?: number;
  startDate?: Date;
  endDate?: Date;
  availableSeats?: number;
  category?: EventCategory;
  location?: string;
  ticketTypes?: {
    id?: number;
    name: string;
    price: number;
    quantity: number;
    description?: string;
  }[];
  promotions?: {
    discount: number;
    startDate: Date;
    endDate: Date;
    maxUses?: number;
  }[];
}

export interface SoftDeleteEventDTO {
  slug: string;
}

export interface SearchParams {
  name?: string;
  category?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateProfileDto {
  name?: string;
  profilePicture?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface TransactionRequest {
  userId: number;
  eventId: number;
  ticketTypeId: number;
  quantity: number;
  pointsUsed: number;
  couponId?: number;
  promotionId?: string;
}

export interface CreateVoucherInput {
  discount: number;
  expiresAt: string;
  maxUses?: number;
}

export interface EventAnalytics {
  totalSales: number;
  ticketsSold: number;
  averageRating: number;
  salesByTicketType: TicketTypeSales[];
  transactionStatuses: TransactionStatusCount[];
}

export interface OrganizerAnalytics {
  totalEvents: number;
  eventsByCategory: CategoryCount[];
  totalRevenue: number;
  bestSellingEvents: BestSellingEvent[];
  upcomingEvents: UpcomingEvent[];
}

export interface TicketTypeSales {
  ticketTypeId: number;
  _sum: {
    quantity: number;
    totalPrice: number;
  };
}

export interface TransactionStatusCount {
  status: string;
  _count: number;
}

export interface CategoryCount {
  category: string;
  _count: number;
}

export interface BestSellingEvent {
  name: string;
  salesCount: number;
}

export interface UpcomingEvent {
  name: string;
  startDate: Date;
  availableSeats: number;
  _count: {
    transactions: number;
  };
}

export interface TransactionWithImage {
  transactionId: number;
  imageUrl: string;
}

export interface CronJob {
  schedule: string;
  handler: () => Promise<void>;
}

export interface JobsRegistry {
  [key: string]: CronJob;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}
