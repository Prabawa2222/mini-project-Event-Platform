import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import prisma from "../../prisma/client";
import jwt from "jsonwebtoken";
import { UserService } from "../services/userService";
import { CreateUserDto } from "../types";
import { ImageService } from "../services/utilService";
import multer from "multer";

export class UserController {
  private userService: UserService;
  private imageService: ImageService;

  constructor() {
    this.userService = new UserService();
    this.imageService = new ImageService();
  }

  registeUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const user = await this.userService.registerUser(userData);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };

  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.loginUser(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      // const userId = req.user?.id;
      // if (!userId) {
      //   res.status(401).json({ success: false, message: "Unauthorized" });
      //   return;
      // }
      // not save
      const userId = Number(req.query.userId);
      if (isNaN(userId)) {
        res
          .status(400)
          .json({ success: false, message: "Invalid user ID format" });
        return;
      }

      const profile = await this.userService.getUserProfile(userId);
      res.json({ success: true, data: profile });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    ImageService.upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: "File upload error: " + err.message,
        });
      }
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      try {
        const userId = parseInt(req.params.id);
        let userData;

        try {
          userData = req.body.data
            ? JSON.parse(req.body.data)
            : { name: req.body.name };
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: "Invalid data format",
          });
        }

        let profilePictureUrl = undefined;
        if (req.file) {
          try {
            profilePictureUrl = await this.imageService.uploadImage(req.file);
          } catch (error) {
            return res.status(400).json({
              success: false,
              message: "Failed to upload image",
            });
          }
        }

        const updateData = {
          ...userData,
          profilePicture: profilePictureUrl || userData.profilePicture,
        };

        const updatedUser = await this.userService.updateUserProfile(
          userId,
          updateData
        );
        res.json({ success: true, data: updatedUser });
      } catch (error: any) {
        res.status(400).json({
          success: false,
          message: error.message || "Failed to update profile",
        });
      }
    });
  };

  changeUserPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      await this.userService.changeUserPassword(userId, req.body);
      res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email || typeof email !== "string") {
        res.status(400).json({
          success: false,
          message: "Valid email is required",
        });
        return;
      }

      const result = await this.userService.forgotPassword({ email });

      res.status(200).json({
        success: true,
        message:
          "If an account exists with that email, a password reset link has been sent",
        ...(result.previewUrl && { previewUrl: result.previewUrl }),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to process request",
      });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, newPassword } = req.body;

      if (
        !token ||
        !newPassword ||
        typeof token !== "string" ||
        typeof newPassword !== "string"
      ) {
        res.status(400).json({
          success: false,
          message: "Token and new password are required",
        });
        return;
      }

      await this.userService.resetPassword({ token, newPassword });
      res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  expireCoupons = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.userService.expireCoupons();
      res
        .status(200)
        .json({ success: true, message: "Coupons expired successfully" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  expirePoints = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.userService.expirePoints();
      res
        .status(200)
        .json({ success: true, message: "Points expired successfully" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
