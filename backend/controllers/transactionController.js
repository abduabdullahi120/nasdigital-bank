import Transaction from "../models/Transaction.js";
import { getTransactionStatus } from "../services/nibssService.js";

// =====================================
// GET CUSTOMER TRANSACTION HISTORY
// =====================================
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Transaction history retrieved successfully",
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error(
      "Transaction history error:",
      error.message
    );

    return res.status(500).json({
      message: "Unable to retrieve transaction history",
    });
  }
};
export const checkTransactionStatus = async (req, res) => {
  try {
    const { reference } = req.params;

    const transaction = await Transaction.findOne({
      reference,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    const result = await getTransactionStatus(reference);

    transaction.status = result.status || transaction.status;

    await transaction.save();

    return res.status(200).json({
      message: "Transaction status retrieved successfully",
      transaction: result,
    });
  } catch (error) {
    console.error(
      "Transaction status error:",
      error.response?.data || error.message
    );

    return res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message ||
        "Unable to retrieve transaction status",
    });
  }
};