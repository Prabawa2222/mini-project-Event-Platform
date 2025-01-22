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

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const user = await this.userService.register(userData);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };
}
