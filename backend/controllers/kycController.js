import User from "../models/User.js";

import {
  validateBvn,
  validateNin,
} from "../services/nibssService.js";


// ==========================================
// HELPER: NORMALIZE NAME
// ==========================================
const normalizeName = (name) => {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};


// ==========================================
// HELPER: CHECK CUSTOMER NAME
// ==========================================
const identityMatchesUser = (user, kycData) => {
  const userFirstName = normalizeName(user.firstName);
  const userLastName = normalizeName(user.lastName);

  const kycFirstName = normalizeName(kycData.firstName);
  const kycLastName = normalizeName(kycData.lastName);

  return (
    userFirstName === kycFirstName &&
    userLastName === kycLastName
  );
};


// ==========================================
// VERIFY BVN
// ==========================================
export const verifyBvn = async (req, res) => {
  try {
    const { bvn } = req.body || {};

    // Check BVN exists
    if (!bvn) {
      return res.status(400).json({
        message: "BVN is required",
      });
    }

    // BVN must contain exactly 11 digits
    if (!/^\d{11}$/.test(String(bvn))) {
      return res.status(400).json({
        message: "BVN must contain exactly 11 digits",
      });
    }

    // Find logged-in customer
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Do not allow KYC changes after account creation
    if (user.accountNumber) {
      return res.status(400).json({
        message:
          "KYC cannot be changed after a bank account has been created",
      });
    }

    // Prevent changing existing KYC
    if (
      user.isKycVerified &&
      user.kycID &&
      user.kycID !== String(bvn)
    ) {
      return res.status(400).json({
        message:
          "KYC has already been completed with another identity",
      });
    }

    // Validate BVN through NIBSS
    const result = await validateBvn(String(bvn));

    if (result.success === false) {
      return res.status(400).json({
        message:
          result.message || "BVN validation failed",
      });
    }

    const kycData =
      result.data ||
      result.response ||
      result;

    if (!kycData.bvn) {
      return res.status(400).json({
        message:
          "BVN validation did not return customer information",
      });
    }

    // Check that BVN belongs to registered customer
    if (!identityMatchesUser(user, kycData)) {
      return res.status(400).json({
        message:
          "The name on this BVN does not match your registered NASDigital Bank name",
      });
    }

    // Make sure DOB exists
    if (!kycData.dob) {
      return res.status(400).json({
        message:
          "Date of birth was not returned by BVN verification",
      });
    }

    // Save verified KYC
    user.kycType = "bvn";
    user.kycID = String(bvn);
    user.dob = new Date(kycData.dob);
    user.isKycVerified = true;

    await user.save();

    return res.status(200).json({
      message: "BVN verified successfully",

      kyc: kycData,

      user: {
        id: user._id,
        kycType: user.kycType,
        kycID: user.kycID,
        dob: user.dob,
        isKycVerified: user.isKycVerified,
      },
    });
  } catch (error) {
    console.error(
      "BVN verification error:",
      error.response?.data || error.message
    );

    return res
      .status(error.response?.status || 500)
      .json({
        message: "BVN verification failed",
        error:
          error.response?.data ||
          error.message,
      });
  }
};


// ==========================================
// VERIFY NIN
// ==========================================
export const verifyNin = async (req, res) => {
  try {
    const { nin } = req.body || {};

    // Check NIN exists
    if (!nin) {
      return res.status(400).json({
        message: "NIN is required",
      });
    }

    // NIN must contain exactly 11 digits
    if (!/^\d{11}$/.test(String(nin))) {
      return res.status(400).json({
        message: "NIN must contain exactly 11 digits",
      });
    }

    // Find logged-in customer
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Do not allow KYC changes after account creation
    if (user.accountNumber) {
      return res.status(400).json({
        message:
          "KYC cannot be changed after a bank account has been created",
      });
    }

    // Prevent changing existing KYC
    if (
      user.isKycVerified &&
      user.kycID &&
      user.kycID !== String(nin)
    ) {
      return res.status(400).json({
        message:
          "KYC has already been completed with another identity",
      });
    }

    // Validate NIN through NIBSS
    const result = await validateNin(String(nin));

    if (result.success === false) {
      return res.status(400).json({
        message:
          result.message || "NIN validation failed",
      });
    }

    const kycData =
      result.data ||
      result.response ||
      result;

    if (!kycData.nin) {
      return res.status(400).json({
        message:
          "NIN validation did not return customer information",
      });
    }

    // Check that NIN belongs to registered customer
    if (!identityMatchesUser(user, kycData)) {
      return res.status(400).json({
        message:
          "The name on this NIN does not match your registered NASDigital Bank name",
      });
    }

    // DOB is required for account creation
    if (!kycData.dob) {
      return res.status(400).json({
        message:
          "Date of birth was not returned by NIN verification",
      });
    }

    // Save verified KYC
    user.kycType = "nin";
    user.kycID = String(nin);
    user.dob = new Date(kycData.dob);
    user.isKycVerified = true;

    await user.save();

    return res.status(200).json({
      message: "NIN verified successfully",

      kyc: kycData,

      user: {
        id: user._id,
        kycType: user.kycType,
        kycID: user.kycID,
        dob: user.dob,
        isKycVerified: user.isKycVerified,
      },
    });
  } catch (error) {
    console.error(
      "NIN verification error:",
      error.response?.data || error.message
    );

    return res
      .status(error.response?.status || 500)
      .json({
        message: "NIN verification failed",
        error:
          error.response?.data ||
          error.message,
      });
  }
};