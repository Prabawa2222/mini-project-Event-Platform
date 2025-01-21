import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
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
}
