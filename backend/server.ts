import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes";
import eventRoutes from "./src/routes/eventRoutes";
import transactionRoutes from "./src/routes/transactionRoutes";
import analyticsRoutes from "./src/routes/analyticsRoutes";
import reviewRoutes from "./src/routes/reviewRoutes";
import { authenticate } from "./src/middleware/authMiddleware";
import { initializeCronJobs } from "./src/cron";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT;

// app.use(authenticate as express.RequestHandler);

initializeCronJobs();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/review", reviewRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
