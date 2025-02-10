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

export interface CreateEventDto {
  name: string;
  description: string;
  price: number;
  startDate: Date;
  endDate: Date;
  availableSeats: number;
  category: string;
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
  category: string;
  location: string;
  imageUrl: string;
}

export interface UpdateEventDTO {
  name?: string;
  description?: string;
  price?: number;
  startDate?: Date;
  endDate?: Date;
  availableSeats?: number;
  category?: string;
  location?: string;
  ticketTypes?: {
    id?: number;
    name: string;
    price: number;
    quantity: number;
    description?: string;
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
  promotionId?: number;
}

export interface CreateVoucherInput {
  discount: number;
  expiresAt: string;
  maxUses?: number;
}
