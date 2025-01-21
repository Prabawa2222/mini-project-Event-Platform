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
    } catch (error) {
      res.status(400).json({ message: error });
    }
  };
}
