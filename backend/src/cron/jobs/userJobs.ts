import { UserService } from "../../services/userService";
import { CronJob } from "../../types";

const userService = new UserService();

const expireCoupons = async () => {
  try {
    const result = await userService.expireCoupons();
    return result;
  } catch (error) {
    console.error("Error in expire transaction job:", error);
    throw error;
  }
};

const expirePoints = async () => {
  try {
    const result = await userService.expirePoints();
    return result;
  } catch (error) {
    console.error("Error in expire transaction job:", error);
    throw error;
  }
};

export const userStatusJobs: Record<string, CronJob> = {
  expireCoupons: {
    schedule: "* * * * *",
    handler: expireCoupons,
  },
  expirePoints: {
    schedule: "0 0 * * *",
    handler: expirePoints,
  },
};
