import { Router } from "express";
import { TransactionController } from "../controllers/transactionController";
import { ImageService } from "../services/utilService";

const router = Router();
const transaction = new TransactionController();
const imageService = new ImageService();

router.post("/", async (req, res) => {
  await transaction.createTransaction(req, res);
});

router.get("/", (req, res) => transaction.getAllTransaction(req, res));

router.get("/:id", (req, res) => transaction.getTransactionById(req, res));

router.post("/:id/payment-proof", (req, res) =>
  transaction.uploadPaymentProof(req, res)
);

router.post("/update-statuses", (req, res) =>
  transaction.updateStatuses(req, res)
);
router.post("/rollback/:id", (req, res) =>
  transaction.rollbackTransaction(req, res)
);

router.get("/organizer/:organizerId", (req, res) =>
  transaction.getTransactionsByOrganizerId(req, res)
);

router.get("/organizer/:organizerId/pending", (req, res) =>
  transaction.getPendingTransactionsByOrganizerId(req, res)
);

router.get("/organizer/:organizerId/summary", (req, res) =>
  transaction.getTransactionsSummaryByOrganizerId(req, res)
);

router.post("/:id/approve", (req, res) =>
  transaction.approveTransaction(req, res)
);

router.post("/:id/reject", (req, res) =>
  transaction.rejectTransaction(req, res)
);

export default router;
