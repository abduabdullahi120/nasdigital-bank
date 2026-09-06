import axios from "axios";

let cachedToken = null;

// ==========================================
// GET NIBSS TOKEN
// ==========================================
const getNibssToken = async () => {
  try {
    const baseURL = process.env.NIBSS_BASE_URL;

    const response = await axios.post(
      `${baseURL}/api/auth/token`,
      {
        apiKey: process.env.NIBSS_API_KEY,
        apiSecret: process.env.NIBSS_API_SECRET,
      }
    );

    cachedToken = response.data.token;

    return cachedToken;
  } catch (error) {
    console.error(
      "NIBSS authentication error:",
      error.response?.data || error.message
    );

    throw new Error("Unable to authenticate with NIBSS");
  }
};

// ==========================================
// GET AUTHORIZATION HEADER
// ==========================================
const getAuthHeader = async () => {
  if (!cachedToken) {
    await getNibssToken();
  }

  return {
    Authorization: `Bearer ${cachedToken}`,
  };
};

// ==========================================
// CHECK IF TOKEN HAS EXPIRED
// ==========================================
const isTokenExpiredError = (error) => {
  const message =
    error.response?.data?.message?.toLowerCase() || "";

  return (
    error.response?.status === 401 ||
    message.includes("invalid or expired token")
  );
};

// ==========================================
// VALIDATE BVN
// ==========================================
export const validateBvn = async (bvn) => {
  const baseURL = process.env.NIBSS_BASE_URL;

  try {
    const headers = await getAuthHeader();

    const response = await axios.post(
      `${baseURL}/api/validateBvn`,
      {
        bvn,
      },
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    if (isTokenExpiredError(error)) {
      console.log("NIBSS token expired. Refreshing token...");

      cachedToken = null;

      const headers = await getAuthHeader();

      const response = await axios.post(
        `${baseURL}/api/validateBvn`,
        {
          bvn,
        },
        {
          headers,
        }
      );

      return response.data;
    }

    throw error;
  }
};

// ==========================================
// VALIDATE NIN
// ==========================================
export const validateNin = async (nin) => {
  const baseURL = process.env.NIBSS_BASE_URL;

  try {
    const headers = await getAuthHeader();

    const response = await axios.post(
      `${baseURL}/api/validateNin`,
      {
        nin,
      },
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    if (isTokenExpiredError(error)) {
      console.log("NIBSS token expired. Refreshing token...");

      cachedToken = null;

      const headers = await getAuthHeader();

      const response = await axios.post(
        `${baseURL}/api/validateNin`,
        {
          nin,
        },
        {
          headers,
        }
      );

      return response.data;
    }

    throw error;
  }
};

// ==========================================
// CREATE NIBSS ACCOUNT
// ==========================================
export const createNibssAccount = async ({
  kycType,
  kycID,
  dob,
}) => {
  const baseURL = process.env.NIBSS_BASE_URL;

  try {
    const headers = await getAuthHeader();

    const response = await axios.post(
      `${baseURL}/api/account/create`,
      {
        kycType,
        kycID,
        dob,
      },
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    if (isTokenExpiredError(error)) {
      console.log("NIBSS token expired. Refreshing token...");

      cachedToken = null;

      const headers = await getAuthHeader();

      const response = await axios.post(
        `${baseURL}/api/account/create`,
        {
          kycType,
          kycID,
          dob,
        },
        {
          headers,
        }
      );

      return response.data;
    }

    throw error;
  }
};

// ==========================================
// GET ACCOUNT BALANCE
// ==========================================
export const getNibssBalance = async (accountNumber) => {
  const baseURL = process.env.NIBSS_BASE_URL;

  try {
    const headers = await getAuthHeader();

    const response = await axios.get(
      `${baseURL}/api/account/balance/${accountNumber}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    if (isTokenExpiredError(error)) {
      console.log("NIBSS token expired. Refreshing token...");

      cachedToken = null;

      const headers = await getAuthHeader();

      const response = await axios.get(
        `${baseURL}/api/account/balance/${accountNumber}`,
        {
          headers,
        }
      );

      return response.data;
    }

    throw error;
  }
};

// ==========================================
// NAME ENQUIRY
// ==========================================
export const nameEnquiry = async (accountNumber) => {
  const baseURL = process.env.NIBSS_BASE_URL;

  try {
    const headers = await getAuthHeader();

    const response = await axios.get(
      `${baseURL}/api/account/name-enquiry/${accountNumber}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    if (isTokenExpiredError(error)) {
      console.log("NIBSS token expired. Refreshing token...");

      cachedToken = null;

      const headers = await getAuthHeader();

      const response = await axios.get(
        `${baseURL}/api/account/name-enquiry/${accountNumber}`,
        {
          headers,
        }
      );

      return response.data;
    }

    throw error;
  }
};

// ==========================================
// TRANSFER MONEY
// ==========================================
export const transferMoney = async ({
  fromAccount,
  toAccount,
  amount,
}) => {
  const baseURL = process.env.NIBSS_BASE_URL;

  try {
    const headers = await getAuthHeader();

    const response = await axios.post(
      `${baseURL}/api/transfer`,
      {
        from: fromAccount,
        to: toAccount,
        amount: String(amount),
      },
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    if (isTokenExpiredError(error)) {
      console.log("NIBSS token expired. Refreshing token...");

      cachedToken = null;

      const headers = await getAuthHeader();

      const response = await axios.post(
        `${baseURL}/api/transfer`,
        {
          from: fromAccount,
          to: toAccount,
          amount: String(amount),
        },
        {
          headers,
        }
      );

      return response.data;
    }

    throw error;
  }
};
export const getTransactionStatus = async (reference) => {
  const baseURL = process.env.NIBSS_BASE_URL;

  try {
    const headers = await getAuthHeader();

    const response = await axios.get(
      `${baseURL}/api/transaction/${reference}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    if (isTokenExpiredError(error)) {
      cachedToken = null;

      const headers = await getAuthHeader();

      const response = await axios.get(
        `${baseURL}/api/transaction/${reference}`,
        {
          headers,
        }
      );

      return response.data;
    }

    throw error;
  }
};