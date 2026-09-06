import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import kycRoutes from "./routes/kycRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "NASDigital Bank API is running",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/transactions", transactionRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`NASDigital Bank server running on port ${PORT}`);
});