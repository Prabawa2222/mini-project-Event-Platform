import { Router } from "express";
import { TransactionController } from "../controllers/transactionController";

const router = Router();
const transaction = new TransactionController();

router.post("/", async (req, res) => {
  await transaction.createTransaction(req, res);
});

router.get("/", (req, res) => transaction.getAllTransaction(req, res));

router.get("/:id", (req, res) => transaction.getTransactionById(req, res));

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
