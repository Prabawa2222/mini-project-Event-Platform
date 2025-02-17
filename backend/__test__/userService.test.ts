import { PrismaClient, UserRole } from "@prisma/client";
import { UserService } from "../src/services/userService";
import jwt from "jsonwebtoken";

// Mock environment variables
process.env.JWT_SECRET = "test-secret";

// Mock PrismaClient and other dependencies
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(),
  UserRole: {
    CUSTOMER: "CUSTOMER",
    ORGANIZER: "ORGANIZER",
  },
  PointsType: {
    REFERRAL: "REFERRAL",
    EXPIRED: "EXPIRED",
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mocked-token"),
}));

describe("UserService", () => {
  let userService: UserService;
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Basic mock setup
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      pointsHistory: {
        create: jest.fn(),
      },
      coupon: {
        create: jest.fn(),
      },
    };

    (PrismaClient as jest.Mock).mockImplementation(() => mockPrisma);
    userService = new UserService();
  });

  // Test registration
  describe("registerUser", () => {
    it("should register a new user successfully", async () => {
      // Setup
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 1,
        ...userData,
        role: UserRole.CUSTOMER,
        referralCode: "TEST123",
        points: 0,
      });

      // Execute
      const result = await userService.registerUser(userData);

      // Verify
      expect(result).toHaveProperty("id", 1);
      expect(result).toHaveProperty("email", userData.email);
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it("should throw error if email exists", async () => {
      const userData = {
        email: "existing@example.com",
        password: "password123",
        name: "Test User",
      };

      mockPrisma.user.findUnique.mockResolvedValue({ id: 1 });

      await expect(userService.registerUser(userData)).rejects.toThrow(
        "Email already registered"
      );
    });
  });

  // Test login
  describe("loginUser", () => {
    it("should login user successfully", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
        name: "Test User",
        role: UserRole.CUSTOMER,
        referralCode: "TEST123",
        points: 0,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.loginUser(
        "test@example.com",
        "password123"
      );

      expect(result).toHaveProperty("token");
      expect(result.user).toHaveProperty("id", 1);
      expect(result.user).toHaveProperty("email", "test@example.com");
      expect(jwt.sign).toHaveBeenCalled();
    });

    it("should throw error for invalid credentials", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        userService.loginUser("wrong@example.com", "wrongpass")
      ).rejects.toThrow("Invalid credentials");
    });
  });

  // Test get profile
  describe("getUserProfile", () => {
    it("should get customer profile", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        role: UserRole.CUSTOMER,
        referralCode: "TEST123",
        points: 0,
        profilePicture: null,
        coupons: [],
        pointsHistory: [],
      };

      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        coupons: [],
        pointsHistory: [],
      });

      const result = await userService.getUserProfile(1);

      expect(result).toHaveProperty("id", 1);
      expect(result).toHaveProperty("email", "test@example.com");
      expect(result).toHaveProperty("activeCoupons", "");
    });

    it("should get organizer profile", async () => {
      const mockUser = {
        id: 1,
        email: "organizer@example.com",
        name: "Test Organizer",
        role: UserRole.ORGANIZER,
        profilePicture: null,
        events: [],
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.getUserProfile(1);

      expect(result).toHaveProperty("id", 1);
      expect(result).toHaveProperty("email", "organizer@example.com");
      expect(result).toHaveProperty("name", "Test Organizer");
    });
  });
});
