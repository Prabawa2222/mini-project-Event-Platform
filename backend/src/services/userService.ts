import prisma from "../../prisma/client";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateProfileDto,
  UserResponse,
} from "../types";
import { PrismaClient, UserRole, CouponType, PointsType } from "@prisma/client";
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

  private generateDiscountCoupon(): string {
    return `DISCOUNT-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  }

  private generateToken(userId: number, role: UserRole): string {
    return jwt.sign({ id: userId, role }, JWT_SECRET!, { expiresIn: "24h" });
  }

  async registerUser(userData: CreateUserDto): Promise<UserResponse> {
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
          points: 10000,
          type: "REFERRAL",
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          // 3 bulan abisnya
        },
      });

      await this.prisma.user.update({
        where: { id: referrerUser.id },
        data: { points: { increment: 10000 } },
      });

      const couponCode = this.generateDiscountCoupon();
      await this.prisma.coupon.create({
        data: {
          userId: user.id,
          code: couponCode,
          discount: 10,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          type: CouponType.REFERRAL,
        },
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

  async loginUser(
    email: string,
    password: string
  ): Promise<{
    token: string;
    user: UserResponse;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bycrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken(user.id, user.role);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        referralCode: user.referralCode,
        points: user.points,
      },
    };
  }

  async updateUserProfile(
    userId: number,
    data: UpdateProfileDto
  ): Promise<UserResponse> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        profilePicture: data.profilePicture,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      referralCode: user.referralCode,
      points: user.points,
      profilePicture: user.profilePicture,
    };
  }

  async changeUserPassword(
    userId: number,
    data: ChangePasswordDto
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !(await bycrypt.compare(data.oldPassword, user.password))) {
      throw new Error("Invalid current password");
    }

    const hashedPassword = await bycrypt.hash(data.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async expireCoupons(): Promise<void> {
    const expiredCoupons = await this.prisma.coupon.updateMany({
      where: {
        expiresAt: { lte: new Date() },
        isUsed: false,
      },
      data: { isUsed: true },
    });
    console.log(`${expiredCoupons.count} coupons expired.`);
  }

  async expirePoints(): Promise<void> {
    const expiredPoints = await this.prisma.pointsHistory.updateMany({
      where: {
        expiresAt: { lte: new Date() },
        type: PointsType.REFERRAL,
      },
      data: { type: PointsType.EXPIRED },
    });
    console.log(`${expiredPoints.count} points records expired.`);
  }
}
