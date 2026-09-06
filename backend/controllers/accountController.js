import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import {
  createNibssAccount,
  getNibssBalance,
  nameEnquiry,
  transferMoney,
} from "../services/nibssService.js";
// =====================================
// CREATE ACCOUNT
// =====================================
export const createAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.isKycVerified) {
      return res.status(400).json({
        message:
          "Complete KYC verification before creating an account",
      });
    }

    if (user.accountNumber) {
      return res.status(400).json({
        message:
          "You already have a NASDigital Bank account",
        accountNumber: user.accountNumber,
      });
    }

    if (!user.dob) {
      return res.status(400).json({
        message:
          "Date of birth is missing from KYC record",
      });
    }

    const formattedDob = new Date(user.dob)
      .toISOString()
      .split("T")[0];

    const result = await createNibssAccount({
      kycType: user.kycType,
      kycID: user.kycID,
      dob: formattedDob,
    });

    const account = result.account;

    if (!account) {
      return res.status(400).json({
        message: "Account creation failed",
      });
    }

    user.accountNumber = account.accountNumber;

    await user.save();

    return res.status(201).json({
      message:
        "NASDigital Bank account created successfully",

      account: {
        accountNumber: account.accountNumber,
        accountName: account.accountName,
        bankCode: account.bankCode,
        balance: account.balance,
      },
    });
  } catch (error) {
    console.error(
      "Account creation error:",
      error.response?.data || error.message
    );

    return res
      .status(error.response?.status || 500)
      .json({
        message:
          error.response?.data?.message ||
          "Unable to create account",
      });
  }
};

// =====================================
// GET BALANCE
// =====================================
export const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.accountNumber) {
      return res.status(400).json({
        message:
          "You do not have a bank account yet",
      });
    }

    const result = await getNibssBalance(
      user.accountNumber
    );

    return res.status(200).json({
      message: "Balance retrieved successfully",

      account: {
        accountNumber: user.accountNumber,

        accountName:
          `${user.firstName} ${user.lastName}`,

        balance:
          result.balance ??
          result.account?.balance ??
          result.data?.balance,
      },
    });
  } catch (error) {
    console.error(
      "Balance error:",
      error.response?.data || error.message
    );

    return res
      .status(error.response?.status || 500)
      .json({
        message:
          error.response?.data?.message ||
          "Unable to retrieve account balance",
      });
  }
};

// =====================================
// NAME ENQUIRY
// =====================================
export const getNameEnquiry = async (req, res) => {
  try {
    const { accountNumber } = req.body;

    // Make sure account number was supplied
    if (!accountNumber) {
      return res.status(400).json({
        message: "Recipient account number is required",
      });
    }

    // Nigerian bank account numbers are normally 10 digits
    if (!/^\d{10}$/.test(accountNumber)) {
      return res.status(400).json({
        message:
          "Account number must contain exactly 10 digits",
      });
    }

    // Customer must have their own account first
    if (!req.user.accountNumber) {
      return res.status(400).json({
        message:
          "You must create a NASDigital Bank account first",
      });
    }

    const result = await nameEnquiry(accountNumber);

    return res.status(200).json({
      message: "Account name retrieved successfully",
      recipient:
        result.account ||
        result.data ||
        result,
    });
  } catch (error) {
    console.error(
      "Name enquiry error:",
      error.response?.data || error.message
    );

    return res
      .status(error.response?.status || 500)
      .json({
        message:
          error.response?.data?.message ||
          "Unable to retrieve account name",
      });
  }
};
// =====================================
// TRANSFER MONEY
// =====================================
export const makeTransfer = async (req, res) => {
  try {
    const { receiverAccount, amount } = req.body;

    // Check recipient account
    if (!receiverAccount) {
      return res.status(400).json({
        message: "Recipient account number is required",
      });
    }

    // Validate account number
    if (!/^\d{10}$/.test(receiverAccount)) {
      return res.status(400).json({
        message: "Recipient account number must be exactly 10 digits",
      });
    }

    // Validate amount
    const transferAmount = Number(amount);

    if (!transferAmount || transferAmount <= 0) {
      return res.status(400).json({
        message: "Enter a valid transfer amount",
      });
    }

    // Get logged-in customer
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Customer must have an account
    if (!user.accountNumber) {
      return res.status(400).json({
        message: "You do not have a bank account yet",
      });
    }

    // Prevent transfer to same account
    if (user.accountNumber === receiverAccount) {
      return res.status(400).json({
        message: "You cannot transfer money to the same account",
      });
    }

    // Check recipient exists before transfer
    const recipientResult = await nameEnquiry(receiverAccount);

    const recipient =
      recipientResult.account ||
      recipientResult.data ||
      recipientResult;

    // Check sender balance
    const balanceResult = await getNibssBalance(
      user.accountNumber
    );

    const currentBalance =
      balanceResult.balance ??
      balanceResult.account?.balance ??
      balanceResult.data?.balance;

    if (currentBalance === undefined) {
      return res.status(400).json({
        message: "Unable to determine account balance",
      });
    }

    if (transferAmount > Number(currentBalance)) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // Send transfer to NIBSS
    const result = await transferMoney({
      fromAccount: user.accountNumber,
      toAccount: receiverAccount,
      amount: transferAmount,
    });
    // Save transaction to NASDigital Bank database
const transaction = await Transaction.create({
  user: user._id,

  reference:
    result.reference ||
    result.transactionId,

  senderAccount: user.accountNumber,

  receiverAccount: receiverAccount,

  receiverName: recipient.accountName,

  bankCode: recipient.bankCode,

  amount: transferAmount,

  type: "debit",

  status: result.status,
});

   return res.status(200).json({
  message: "Transfer processed successfully",

  transfer: result,

  transaction: {
    id: transaction._id,
    reference: transaction.reference,
    amount: transaction.amount,
    status: transaction.status,
    createdAt: transaction.createdAt,
  },

  recipient: {
    accountName: recipient.accountName,
    accountNumber: recipient.accountNumber,
    bankCode: recipient.bankCode,
  },
});
  } catch (error) {
    console.error(
      "Transfer error:",
      error.response?.data || error.message
    );

    return res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message ||
        "Unable to process transfer",
    });
  }
};