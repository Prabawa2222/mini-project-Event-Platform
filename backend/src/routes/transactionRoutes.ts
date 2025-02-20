import { Router } from "express";
import { TransactionController } from "../controllers/transactionController";
import { ImageService } from "../services/utilService";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
const transaction = new TransactionController();
const imageService = new ImageService();

router.post("/", async (req, res) => {
  await transaction.createTransaction(req, res);
});

router.get("/", authenticate, (req, res) =>
  transaction.getAllTransaction(req, res)
);

router.get("/:id", authenticate, (req, res) =>
  transaction.getTransactionById(req, res)
);

router.post("/:id/payment-proof", authenticate, (req, res) =>
  transaction.uploadPaymentProof(req, res)
);

router.get("/user/:userId", authenticate, (req, res) =>
  transaction.getUserTransactions(req, res)
);

router.post("/update-statuses", authenticate, (req, res) =>
  transaction.updateStatuses(req, res)
);
router.post("/rollback/:id", authenticate, (req, res) =>
  transaction.rollbackTransaction(req, res)
);

router.get("/organizer/:organizerId", authenticate, (req, res) =>
  transaction.getTransactionsByOrganizerId(req, res)
);

router.get("/organizer/:organizerId/pending", authenticate, (req, res) =>
  transaction.getPendingTransactionsByOrganizerId(req, res)
);

router.get("/organizer/:organizerId/summary", authenticate, (req, res) =>
  transaction.getTransactionsSummaryByOrganizerId(req, res)
);

router.post("/:id/approve", authenticate, (req, res) =>
  transaction.approveTransaction(req, res)
);

router.post("/:id/reject", authenticate, (req, res) =>
  transaction.rejectTransaction(req, res)
);

export default router;
