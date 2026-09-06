import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import api from "../services/api";
import logo from "../assets/logo.png";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkingReference, setCheckingReference] = useState(null);

  const loadTransactions = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await api.get("/transactions");

      setTransactions(
        response.data.transactions || []
      );
    } catch (error) {
      console.error(
        "Transaction history error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to load transaction history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const checkStatus = async (reference) => {
    setCheckingReference(reference);
    setError("");

    try {
      const response = await api.get(
        `/transactions/${reference}/status`
      );

      const updatedStatus =
        response.data.transaction?.status;

      setTransactions((currentTransactions) =>
        currentTransactions.map((transaction) =>
          transaction.reference === reference
            ? {
                ...transaction,
                status:
                  updatedStatus ||
                  transaction.status,
              }
            : transaction
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to check transaction status."
      );
    } finally {
      setCheckingReference(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
              Secure Banking
            </span>

          </div>

        </div>

      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-12">

        {/* BACK */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#082f68] text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        {/* TITLE */}
        <div className="mt-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

          <div>
            <p className="text-green-600 text-sm font-semibold">
              ACCOUNT ACTIVITY
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#082f68] mt-2">
              Transactions
            </h1>

            <p className="text-slate-500 mt-3">
              View your NASDigital Bank transaction history.
            </p>
          </div>

          <button
            onClick={loadTransactions}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white px-4 py-2.5 rounded-xl text-sm font-semibold text-[#082f68] hover:border-green-500 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loading ? "animate-spin" : ""
              }
            />

            Refresh
          </button>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-7 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* CONTENT */}
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500">

              <Loader2
                size={30}
                className="animate-spin text-green-600"
              />

              <p className="mt-4">
                Loading transactions...
              </p>

            </div>
          ) : transactions.length === 0 ? (
            <div className="py-20 px-6 text-center">

              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto">

                <ArrowUpRight
                  size={25}
                  className="text-slate-400"
                />

              </div>

              <h2 className="text-lg font-bold text-[#082f68] mt-5">
                No transactions yet
              </h2>

              <p className="text-slate-500 mt-2">
                Your transfers will appear here.
              </p>

              <Link
                to="/transfer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold mt-6"
              >
                Send Money
              </Link>

            </div>
          ) : (
            <div>

              {/* DESKTOP HEADER */}
              <div className="hidden md:grid grid-cols-12 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">

                <div className="col-span-4">
                  Recipient
                </div>

                <div className="col-span-2">
                  Amount
                </div>

                <div className="col-span-2">
                  Status
                </div>

                <div className="col-span-3">
                  Date
                </div>

                <div className="col-span-1" />

              </div>

              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="border-b border-slate-100 last:border-b-0"
                >

                  {/* DESKTOP */}
                  <div className="hidden md:grid grid-cols-12 items-center px-6 py-5">

                    <div className="col-span-4 flex items-center gap-3 min-w-0">

                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <ArrowUpRight
                          size={18}
                          className="text-red-500"
                        />
                      </div>

                      <div className="min-w-0">

                        <p className="font-semibold text-slate-800 truncate">
                          {transaction.receiverName ||
                            "Transfer"}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {transaction.receiverAccount}
                        </p>

                        <p className="text-xs text-slate-400 mt-1 truncate">
                          {transaction.reference}
                        </p>

                      </div>

                    </div>

                    <div className="col-span-2 font-bold text-slate-800">
                      -₦
                      {Number(
                        transaction.amount
                      ).toLocaleString()}
                    </div>

                    <div className="col-span-2">

                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          transaction.status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : transaction.status === "FAILED"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {transaction.status}
                      </span>

                    </div>

                    <div className="col-span-3 text-sm text-slate-500">
                      {formatDate(
                        transaction.createdAt
                      )}
                    </div>

                    <div className="col-span-1 text-right">

                      <button
                        onClick={() =>
                          checkStatus(
                            transaction.reference
                          )
                        }
                        disabled={
                          checkingReference ===
                          transaction.reference
                        }
                        title="Check transaction status"
                        className="text-[#082f68] hover:text-green-600 disabled:opacity-50"
                      >
                        <RefreshCw
                          size={18}
                          className={
                            checkingReference ===
                            transaction.reference
                              ? "animate-spin"
                              : ""
                          }
                        />
                      </button>

                    </div>

                  </div>

                  {/* MOBILE */}
                  <div className="md:hidden p-5">

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">

                          <ArrowUpRight
                            size={18}
                            className="text-red-500"
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="font-semibold text-slate-800 truncate">
                            {transaction.receiverName ||
                              "Transfer"}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {transaction.receiverAccount}
                          </p>

                        </div>

                      </div>

                      <p className="font-bold text-slate-800 shrink-0">
                        -₦
                        {Number(
                          transaction.amount
                        ).toLocaleString()}
                      </p>

                    </div>

                    <div className="mt-4 bg-slate-50 rounded-xl p-4 space-y-3">

                      <div className="flex justify-between gap-4">

                        <span className="text-xs text-slate-500">
                          Status
                        </span>

                        <span
                          className={`text-xs font-semibold ${
                            transaction.status ===
                            "SUCCESS"
                              ? "text-green-600"
                              : transaction.status ===
                                "FAILED"
                              ? "text-red-600"
                              : "text-amber-600"
                          }`}
                        >
                          {transaction.status}
                        </span>

                      </div>

                      <div className="flex justify-between gap-4">

                        <span className="text-xs text-slate-500">
                          Date
                        </span>

                        <span className="text-xs text-slate-700 text-right">
                          {formatDate(
                            transaction.createdAt
                          )}
                        </span>

                      </div>

                      <div className="flex justify-between gap-4">

                        <span className="text-xs text-slate-500">
                          Reference
                        </span>

                        <span className="text-xs text-slate-700 text-right break-all">
                          {transaction.reference}
                        </span>

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        checkStatus(
                          transaction.reference
                        )
                      }
                      disabled={
                        checkingReference ===
                        transaction.reference
                      }
                      className="mt-4 inline-flex items-center gap-2 text-green-600 text-sm font-semibold disabled:opacity-50"
                    >

                      <RefreshCw
                        size={16}
                        className={
                          checkingReference ===
                          transaction.reference
                            ? "animate-spin"
                            : ""
                        }
                      />

                      Check Status

                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default Transactions;