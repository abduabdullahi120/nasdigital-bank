import express from "express";

import {
  verifyBvn,
  verifyNin,
} from "../controllers/kycController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// BVN verification
router.post("/verify-bvn", protect, verifyBvn);

// NIN verification
router.post("/verify-nin", protect, verifyNin);

export default router;