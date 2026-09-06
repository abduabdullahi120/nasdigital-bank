import express from "express";

import {
  createAccount,
  getBalance,
  getNameEnquiry,
  makeTransfer,
} from "../controllers/accountController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

// Create bank account
router.post("/create", protect, createAccount);

// Get logged-in customer's balance
router.get("/balance", protect, getBalance);

// Recipient name enquiry
router.post(
  "/name-enquiry",
  protect,
  getNameEnquiry
);
router.post("/transfer", protect, makeTransfer);

export default router;