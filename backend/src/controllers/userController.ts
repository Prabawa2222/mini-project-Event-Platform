import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import prisma from "../../prisma/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/jwt";
import { UserService } from "../services/userService";
import { CreateUserDto } from "../types";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
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

  updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      await this.userService.updateUserProfile(userId, req.body);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
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
