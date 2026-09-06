import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  LogOut,
  Menu,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";

import api from "../services/api";
import logo from "../assets/logo.png";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profileResponse, balanceResponse, transactionResponse] =
          await Promise.all([
            api.get("/auth/profile"),
            api.get("/account/balance"),
            api.get("/transactions"),
          ]);

        setUser(profileResponse.data.user);

        setBalance(
          balanceResponse.data.account?.balance || 0
        );

        setTransactions(
          transactionResponse.data.transactions || []
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-[#06285c] font-semibold">
          Loading your account...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <header className="bg-[#082f68] border-b border-white/10">
        <div className="max-w-7xl mx-auto h-[76px] px-5 sm:px-8 lg:px-10 flex items-center justify-between">

          <img
            src={logo}
            alt="NASDigital Bank"
            className="w-[115px] sm:w-[135px] object-contain"
          />

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-7 text-sm">

            <Link
              to="/dashboard"
              className="text-white font-semibold"
            >
              Dashboard
            </Link>

            <Link
              to="/transfer"
              className="text-slate-300 hover:text-white"
            >
              Transfer
            </Link>

            <Link
              to="/transactions"
              className="text-slate-300 hover:text-white"
            >
              Transactions
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-2 text-slate-300 hover:text-white"
            >
              <LogOut size={17} />
              Logout
            </button>

          </div>

          {/* MOBILE MENU */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}
          </button>

        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#082f68] border-t border-white/10 px-5 py-4 space-y-4">

            <Link
              to="/dashboard"
              className="block text-white font-semibold"
            >
              Dashboard
            </Link>

            <Link
              to="/transfer"
              className="block text-slate-300"
            >
              Transfer Money
            </Link>

            <Link
              to="/transactions"
              className="block text-slate-300"
            >
              Transactions
            </Link>

            <button
              onClick={logout}
              className="text-slate-300"
            >
              Logout
            </button>

          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 sm:py-10">

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* WELCOME */}
        <section className="mb-8">

          <p className="text-slate-500 text-sm">
            Welcome back
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#06285c] mt-1">
            {user?.firstName} {user?.lastName}
          </h1>

        </section>

        {/* CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* BALANCE */}
          <div className="bg-[#082f68] text-white rounded-2xl p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-slate-300 text-sm">
                  Available Balance
                </p>

                <h2 className="text-3xl sm:text-4xl font-bold mt-3">
                  ₦{Number(balance).toLocaleString()}
                </h2>
              </div>

              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Wallet
                  className="text-green-400"
                  size={25}
                />
              </div>

            </div>

            <div className="mt-7 border-t border-white/10 pt-4">

              <p className="text-xs text-slate-400">
                Account Number
              </p>

              <p className="font-semibold mt-1 tracking-wider">
                {user?.accountNumber || "Not created"}
              </p>

            </div>

          </div>

          {/* KYC */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
              <ShieldCheck
                className="text-green-600"
                size={23}
              />
            </div>

            <p className="text-slate-500 text-sm mt-5">
              KYC Status
            </p>

            <h3 className="text-xl font-bold text-[#06285c] mt-1">
              {user?.isKycVerified
                ? "Verified"
                : "Not Verified"}
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              {user?.kycType
                ? `Verified with ${user.kycType.toUpperCase()}`
                : "Complete identity verification"}
            </p>

          </div>

          {/* ACCOUNT */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
              <CreditCard
                className="text-[#082f68]"
                size={23}
              />
            </div>

            <p className="text-slate-500 text-sm mt-5">
              Bank Account
            </p>

            <h3 className="text-xl font-bold text-[#06285c] mt-1">
              NASDigital Bank
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              {user?.accountNumber || "No account created"}
            </p>

          </div>

        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-8">

          <h2 className="text-xl font-bold text-[#06285c] mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

            <Link
              to="/transfer"
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-green-500 transition"
            >
              <ArrowUpRight
                className="text-green-600"
                size={24}
              />

              <p className="font-semibold text-[#06285c] mt-3">
                Send Money
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Transfer funds
              </p>
            </Link>

            <Link
              to="/transactions"
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-green-500 transition"
            >
              <ArrowDownLeft
                className="text-[#082f68]"
                size={24}
              />

              <p className="font-semibold text-[#06285c] mt-3">
                Transactions
              </p>

              <p className="text-xs text-slate-400 mt-1">
                View history
              </p>
            </Link>

          </div>

        </section>

        {/* RECENT TRANSACTIONS */}
        <section className="mt-10">

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-xl font-bold text-[#06285c]">
              Recent Transactions
            </h2>

            <Link
              to="/transactions"
              className="text-green-600 text-sm font-semibold"
            >
              View All
            </Link>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

            {transactions.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No transactions yet.
              </div>
            ) : (
              transactions
                .slice(0, 5)
                .map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between gap-4 p-5 border-b last:border-b-0 border-slate-100"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                        <ArrowUpRight
                          size={19}
                          className="text-red-500"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-700">
                          {transaction.receiverName}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {transaction.reference}
                        </p>
                      </div>

                    </div>

                    <div className="text-right">

                      <p className="font-bold text-slate-700">
                        -₦
                        {Number(
                          transaction.amount
                        ).toLocaleString()}
                      </p>

                      <span
                        className={`text-xs font-semibold ${
                          transaction.status === "SUCCESS"
                            ? "text-green-600"
                            : "text-orange-500"
                        }`}
                      >
                        {transaction.status}
                      </span>

                    </div>

                  </div>
                ))
            )}

          </div>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;