import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { JWT_SECRET } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: UserRole;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: UserRole;
    };

    //req.user = decoded;
    req.user = { id: 1, role: "ORGANIZER" };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalide token" });
  }
};

export const authorize = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
