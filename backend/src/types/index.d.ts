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

export interface UpdateProfileDto {
  name?: string;
  profilePicture?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}
