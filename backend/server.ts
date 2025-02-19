import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes";
import eventRoutes from "./src/routes/eventRoutes";
import transactionRoutes from "./src/routes/transactionRoutes";
import { authenticate } from "./src/middleware/authMiddleware";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT;

//app.use(authenticate as express.RequestHandler);

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/transaction", transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
