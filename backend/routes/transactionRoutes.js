import express from "express";

import {
  getTransactions,
  checkTransactionStatus,
} from "../controllers/transactionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTransactions);

router.get(
  "/:reference/status",
  protect,
  checkTransactionStatus
);

export default router;