import cron from "node-cron";
import { TransactionService } from "../services/transactionService";

// Set up cron job to run every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  const transactionService = new TransactionService();
  try {
    await transactionService.expireTransaction();
    await transactionService.calcelOldTransaction();
  } catch (error) {
    console.error("Error running cron job for transaction statuses:", error);
  }
});
