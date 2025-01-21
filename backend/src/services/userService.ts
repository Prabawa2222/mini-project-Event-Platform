import prisma from "../../prisma/client";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreateUserDto, UserResponse } from "../types";
import { PrismaClient, UserRole } from "@prisma/client";
import crypto from "crypto";
import { JWT_SECRET } from "../utils/jwt";

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private generateReferralCode(): string {
    return crypto.randomBytes(4).toString("hex").toUpperCase();
  }

  private generateToken(userId: number, role: UserRole): string {
    return jwt.sign({ id: userId, role }, JWT_SECRET!, { expiresIn: "24h" });
  }

  async register(userData: CreateUserDto): Promise<UserResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    let referrerUser;
    if (userData.referralCode) {
      referrerUser = await this.prisma.user.findUnique({
        where: { referralCode: userData.referralCode },
      });
      if (!referrerUser) {
        throw new Error("Invalid referral code");
      }
    }

    const hashedPassword = await bycrypt.hash(userData.password, 10);
    const referralCode = this.generateReferralCode();

    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        referralCode,
        referredBy: userData.referralCode,
        role: UserRole.CUSTOMER,
      },
    });

    // Tambah point kalau ada referal
    if (referrerUser) {
      await this.prisma.pointsHistory.create({
        data: {
          userId: referrerUser.id,
          points: 50,
          type: "REFERRAL",
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      });

      await this.prisma.user.update({
        where: { id: referrerUser.id },
        data: { points: { increment: 50 } },
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      referralCode: user.referralCode,
      points: user.points,
    };
  }
}
