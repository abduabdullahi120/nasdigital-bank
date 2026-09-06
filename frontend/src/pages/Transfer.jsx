import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Send,
  ShieldCheck,
} from "lucide-react";

import api from "../services/api";
import logo from "../assets/logo.png";

function Transfer() {
  const navigate = useNavigate();

  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [recipient, setRecipient] = useState(null);

  const [checkingName, setCheckingName] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  // =====================================
  // NAME ENQUIRY
  // =====================================
  const handleNameEnquiry = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(null);
    setRecipient(null);

    if (!/^\d{10}$/.test(accountNumber)) {
      setError(
        "Please enter a valid 10-digit account number."
      );
      return;
    }

    setCheckingName(true);

    try {
      const response = await api.post(
        "/account/name-enquiry",
        {
          accountNumber: accountNumber,
        }
      );

      setRecipient(response.data.recipient);

    } catch (error) {
      console.error(
        "Name enquiry error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to find this account."
      );
    } finally {
      setCheckingName(false);
    }
  };

  // =====================================
  // TRANSFER
  // =====================================
  const handleTransfer = async () => {
    setError("");

    if (!recipient) {
      setError(
        "Please verify the recipient first."
      );
      return;
    }

    const transferAmount = Number(amount);

    if (
      !transferAmount ||
      transferAmount <= 0
    ) {
      setError(
        "Please enter a valid transfer amount."
      );
      return;
    }

    setSending(true);

    try {
      /*
        IMPORTANT:

        Our backend already knows the sender from
        the logged-in customer's JWT.

        Therefore the frontend sends only:
        receiverAccount + amount
      */

      const response = await api.post(
        "/account/transfer",
        {
          receiverAccount:
            recipient.accountNumber,

          amount: transferAmount,
        }
      );

      setSuccess(response.data);

      setAmount("");

    } catch (error) {
      console.error(
        "Transfer error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Transfer failed. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  // =====================================
  // MAKE ANOTHER TRANSFER
  // =====================================
  const resetTransfer = () => {
    setSuccess(null);
    setRecipient(null);
    setAccountNumber("");
    setAmount("");
    setError("");
  };

  // =====================================
  // SUCCESS SCREEN
  // =====================================
  if (success) {
    const transfer =
      success.transfer || {};

    return (
      <div className="min-h-screen bg-slate-50">

        {/* NAVBAR */}
        <header className="bg-[#082f68] border-b border-white/10">

          <div className="max-w-7xl mx-auto h-[76px] px-5 sm:px-8 lg:px-10 flex items-center justify-between">

            <Link to="/dashboard">
              <img
                src={logo}
                alt="NASDigital Bank"
                className="w-[115px] sm:w-[135px] object-contain"
              />
            </Link>

            <div className="flex items-center gap-2 text-green-400">
              <ShieldCheck size={21} />

              <span className="hidden sm:block text-sm font-medium">
                Secure Banking
              </span>
            </div>

          </div>

        </header>

        {/* SUCCESS */}
        <main className="px-5 py-10 sm:py-16">

          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-9 shadow-sm text-center">

            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">

              <CheckCircle2
                size={42}
                className="text-green-600"
              />

            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#082f68] mt-6">
              Transfer Successful
            </h1>

            <p className="text-slate-500 mt-2">
              Your money has been sent successfully.
            </p>

            {/* DETAILS */}
            <div className="mt-8 bg-slate-50 rounded-2xl p-5 text-left space-y-4">

              <div className="flex justify-between gap-4">

                <span className="text-slate-500">
                  Recipient
                </span>

                <span className="font-semibold text-right text-slate-800">
                  {recipient?.accountName}
                </span>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-slate-500">
                  Account
                </span>

                <span className="font-semibold text-slate-800">
                  {transfer.receiverAccount ||
                    recipient?.accountNumber}
                </span>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-slate-500">
                  Amount
                </span>

                <span className="font-bold text-slate-800">
                  ₦
                  {Number(
                    transfer.amount || 0
                  ).toLocaleString()}
                </span>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-slate-500">
                  Reference
                </span>

                <span className="font-semibold text-xs sm:text-sm break-all text-right text-slate-800">
                  {transfer.reference ||
                    "Unavailable"}
                </span>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-slate-500">
                  Status
                </span>

                <span className="text-green-600 font-bold">
                  {transfer.status ||
                    "SUCCESS"}
                </span>

              </div>

            </div>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="w-full bg-[#082f68] hover:bg-[#062452] text-white py-3.5 rounded-xl font-semibold mt-7 transition"
            >
              Back to Dashboard
            </button>

            <button
              onClick={resetTransfer}
              className="w-full text-green-600 hover:text-green-700 py-3 font-semibold mt-2"
            >
              Make Another Transfer
            </button>

          </div>

        </main>

      </div>
    );
  }

  // =====================================
  // TRANSFER FORM
  // =====================================
  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <header className="bg-[#082f68] border-b border-white/10">

        <div className="max-w-7xl mx-auto h-[76px] px-5 sm:px-8 lg:px-10 flex items-center justify-between">

          <Link to="/dashboard">
            <img
              src={logo}
              alt="NASDigital Bank"
              className="w-[115px] sm:w-[135px] object-contain"
            />
          </Link>

          <div className="flex items-center gap-2 text-green-400">

            <ShieldCheck size={20} />

            <span className="hidden sm:block text-sm font-medium">
              Secure Transfer
            </span>

          </div>

        </div>

      </header>

      {/* CONTENT */}
      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-12">

        {/* BACK */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#082f68] text-sm font-medium"
        >
          <ArrowLeft size={18} />

          Dashboard
        </Link>

        {/* TITLE */}
        <div className="mt-7">

          <p className="text-green-600 text-sm font-semibold">
            MONEY TRANSFER
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#082f68] mt-2">
            Send Money
          </h1>

          <p className="text-slate-500 mt-3">
            Transfer funds securely to another account.
          </p>

        </div>

        {/* TRANSFER CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 mt-8 shadow-sm">

          {/* ERROR */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* NAME ENQUIRY FORM */}
          <form onSubmit={handleNameEnquiry}>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Recipient Account Number
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              value={accountNumber}
              disabled={Boolean(recipient)}
              onChange={(e) => {
                setAccountNumber(
                  e.target.value.replace(
                    /\D/g,
                    ""
                  )
                );

                setError("");
              }}
              placeholder="Enter 10-digit account number"
              className="w-full border border-slate-300 rounded-xl py-3.5 px-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
            />

            {!recipient && (
              <button
                type="submit"
                disabled={
                  checkingName ||
                  accountNumber.length !== 10
                }
                className="w-full mt-5 bg-[#082f68] hover:bg-[#062452] text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition"
              >
                {checkingName ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Checking Account...
                  </>
                ) : (
                  <>
                    Continue

                    <ArrowRight
                      size={18}
                    />
                  </>
                )}
              </button>
            )}

          </form>

          {/* RECIPIENT */}
          {recipient && (
            <div className="mt-6">

              {/* RECIPIENT CARD */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">

                <div className="w-11 h-11 shrink-0 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">

                  {recipient.accountName
                    ?.charAt(0)
                    .toUpperCase()}

                </div>

                <div className="min-w-0">

                  <p className="font-bold text-[#082f68] truncate">
                    {recipient.accountName}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {recipient.accountNumber}
                    {" • "}
                    NASDigital Bank
                  </p>

                </div>

              </div>

              {/* CHANGE RECIPIENT */}
              <button
                type="button"
                onClick={() => {
                  setRecipient(null);
                  setAmount("");
                  setError("");
                }}
                className="text-sm text-green-600 hover:text-green-700 font-semibold mt-3"
              >
                Change recipient
              </button>

              {/* AMOUNT */}
              <div className="mt-6">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Amount
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#082f68] font-bold">
                    ₦
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => {
                      setAmount(
                        e.target.value
                      );

                      setError("");
                    }}
                    placeholder="0.00"
                    className="w-full border border-slate-300 rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />

                </div>

              </div>

              {/* SECURITY NOTE */}
              <div className="mt-7 bg-slate-50 rounded-xl p-4 flex items-start gap-3">

                <ShieldCheck
                  size={20}
                  className="text-green-600 shrink-0 mt-0.5"
                />

                <p className="text-xs sm:text-sm text-slate-500">
                  Confirm the recipient name and transfer
                  amount carefully before sending money.
                </p>

              </div>

              {/* SEND */}
              <button
                type="button"
                onClick={handleTransfer}
                disabled={
                  sending ||
                  !amount ||
                  Number(amount) <= 0
                }
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition"
              >
                {sending ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Processing Transfer...
                  </>
                ) : (
                  <>
                    <Send size={18} />

                    Send Money
                  </>
                )}
              </button>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default Transfer;