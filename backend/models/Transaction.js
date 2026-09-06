import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
    },

    senderAccount: {
      type: String,
      required: true,
    },

    receiverAccount: {
      type: String,
      required: true,
    },

    receiverName: {
      type: String,
      required: true,
    },

    bankCode: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["debit", "credit"],
      default: "debit",
    },

    status: {
      type: String,
      enum: ["SUCCESS", "PENDING", "FAILED"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);

export default Transaction;