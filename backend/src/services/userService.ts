import prisma from "../../prisma/client";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  ChangePasswordDto,
  CreateUserDto,
  ForgotPasswordDto,
  GetProfileOrganizerResponse,
  GetProfileUserResponse,
  ResetPasswordDto,
  UpdateProfileDto,
  UserResponse,
} from "../types";
import { PrismaClient, UserRole, CouponType, PointsType } from "@prisma/client";
import crypto from "crypto";
import { JWT_SECRET } from "../utils/jwt";
import nodemailer from "nodemailer";
import { initializeEmailTransporter } from "../config/mail.config";

export class UserService {
  private prisma: PrismaClient;
  private emailTransporter: any;

  constructor() {
    this.prisma = new PrismaClient();
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    this.emailTransporter = await initializeEmailTransporter();
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
          // 1 menit abisnyta
          expiresAt: new Date(Date.now() + 1 * 60 * 1000),
          //expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
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
  ): Promise<{ token: string; user: UserResponse }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("No account found with this email address");
    }

    const isValidPassword = await bycrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid password");
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

  async getUserProfile(userId: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === UserRole.ORGANIZER) {
      return await this.getOrganizerInfo(userId);
    } else {
      return await this.getCustomerInfo(userId);
    }
  }

  private async getOrganizerInfo(
    userId: number
  ): Promise<GetProfileOrganizerResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        events: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
    };
  }

  private async getCustomerInfo(
    userId: number
  ): Promise<GetProfileUserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        coupons: {
          where: {
            isUsed: false,
            expiresAt: {
              gt: new Date(),
            },
          },
        },
        pointsHistory: {
          where: {
            type: {
              not: PointsType.EXPIRED,
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const activeCoupons = user.coupons.map((coupon) => coupon.code).join(",");

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      referralCode: user.referralCode,
      points: user.points,
      profilePicture: user.profilePicture,
      activeCoupons,
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

  async forgotPassword(
    data: ForgotPasswordDto
  ): Promise<{ previewUrl?: string }> {
    try {
      console.log("Starting forgot password process for:", data.email);

      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        console.log("No user found with email:", data.email);
        return {};
      }

      console.log("User found, generating reset token");
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      console.log("Updating user with reset token");
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: hashedToken,
          resetTokenExpiry: new Date(Date.now() + 3600000),
        },
      });

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      console.log("Reset URL generated:", resetUrl);

      try {
        console.log("Attempting to send email");
        const info = await this.emailTransporter.sendMail({
          from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
          to: user.email,
          subject: "Password Reset Request",
          html: `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          `,
        });

        console.log("Email sent successfully");
        console.log("Email info:", info);

        if (process.env.NODE_ENV === "development") {
          const previewUrl = nodemailer.getTestMessageUrl(info);
          console.log("Preview URL for test email:", previewUrl);
          return previewUrl ? { previewUrl } : {};
        }

        return {};
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Rollback the reset token
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            resetToken: null,
            resetTokenExpiry: null,
          },
        });
        throw emailError;
      }
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordDto): Promise<void> {
    const hashedToken = crypto
      .createHash("sha256")
      .update(data.token)
      .digest("hex");

    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    const hashedPassword = await bycrypt.hash(data.newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }
}
