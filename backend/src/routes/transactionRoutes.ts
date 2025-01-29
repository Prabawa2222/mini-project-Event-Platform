import { Router } from "express";
import { TransactionController } from "../controllers/transactionController";

const router = Router();
const transaction = new TransactionController();

router.post("/", (req, res) => transaction.createTransaction(req, res));
router.patch("/:id/payment-proof", (req, res) =>
  transaction.uploadPaymenProof(req, res)
);
router.post("/update-statuses", (req, res) =>
  transaction.updateStatuses(req, res)
);
router.post("/rollback/:id", (req, res) =>
  transaction.rollbackTransaction(req, res)
);

export default router;
