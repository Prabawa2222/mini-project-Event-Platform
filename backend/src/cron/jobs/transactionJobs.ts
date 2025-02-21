import { TransactionService } from "../../services/transactionService";
import { CronJob } from "../../types";

const transactionService = new TransactionService();

const expireTransactions = async () => {
  console.log("Starting expire transaction check...");
  try {
    const result = await transactionService.expireTransaction();
    console.log("Expire transaction check completed");
    return result;
  } catch (error) {
    console.error("Error in expire transaction job:", error);
    throw error;
  }
};

const cancelOldTransactions = async () => {
  console.log("Starting cancel old transactions check...");
  try {
    const result = await transactionService.calcelOldTransaction();
    console.log("Cancel old transactions check completed");
    return result;
  } catch (error) {
    console.error("Error in cancel transaction job:", error);
    throw error;
  }
};

export const transactionStatusJobs: Record<string, CronJob> = {
  expireTransactions: {
    schedule: "* * * * *", // Every minute
    handler: expireTransactions,
  },
  cancelOldTransactions: {
    schedule: "0 0 * * *", // Once daily at midnight
    handler: cancelOldTransactions,
  },
};
