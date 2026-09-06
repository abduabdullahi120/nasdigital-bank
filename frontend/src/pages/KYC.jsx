import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";
import logo from "../assets/logo.png";

function KYC() {
  const navigate = useNavigate();

  const [kycType, setKycType] = useState("bvn");
  const [kycNumber, setKycNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [creatingAccount, setCreatingAccount] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!/^\d{11}$/.test(kycNumber)) {
      setError(
        `${kycType.toUpperCase()} must be exactly 11 digits`
      );
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        kycType === "bvn"
          ? "/kyc/verify-bvn"
          : "/kyc/verify-nin";

      const body =
        kycType === "bvn"
          ? { bvn: kycNumber }
          : { nin: kycNumber };

      const response = await api.post(
        endpoint,
        body
      );

      setVerified(true);

      setMessage(
        response.data.message ||
          "Identity verified successfully"
      );

      const currentUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          isKycVerified: true,
          kycType,
        })
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to verify identity"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
  // Clear old messages first
  setError("");
  setMessage("");
  setCreatingAccount(true);

  try {
    const response = await api.post("/account/create");

    const account = response.data.account;

    const currentUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...currentUser,
        isKycVerified: true,
        accountNumber: account.accountNumber,
      })
    );

    navigate("/dashboard");

  } catch (error) {
    console.error(
      "Account creation error:",
      error.response?.data || error.message
    );

    setError(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to create bank account"
    );
  } finally {
    setCreatingAccount(false);
  }
};
  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className=" border-b border-white/10">
  <div className="max-w-7xl mx-auto h-[76px] px-5 sm:px-8 lg:px-10 flex items-center justify-between">

    {/* LOGO */}
    <div className="flex items-center">
      <img
        src={logo}
        alt="NASDigital Bank"
        className="w-[115px] sm:w-[135px] h-auto object-contain"
      />
    </div>

    {/* SECURITY STATUS */}
    <div className="flex items-center gap-2 text-green-400">
      <ShieldCheck size={21} />

      <span className="hidden sm:inline text-sm font-medium">
        Secure Banking
      </span>
    </div>

  </div>
</header>

      <main className="px-5 py-10 sm:py-14">

        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-9">
            <div className="w-14 h-14 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-5">
              <BadgeCheck
                className="text-green-600"
                size={30}
              />
            </div>

            <p className="text-green-600 font-semibold text-sm">
              IDENTITY VERIFICATION
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#06285c] mt-2">
              Complete your KYC
            </h1>

            <p className="text-slate-500 mt-3 max-w-lg mx-auto">
              Verify your identity using your test BVN
              or NIN before creating your NASDigital
              Bank account.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">

            {/* KYC TYPE */}
            <div className="grid grid-cols-2 gap-3 mb-7">

              <button
                type="button"
                onClick={() => {
                  setKycType("bvn");
                  setVerified(false);
                  setMessage("");
                  setError("");
                }}
                className={`rounded-xl py-3 font-semibold border transition ${
                  kycType === "bvn"
                    ? "bg-[#06285c] text-white border-[#06285c]"
                    : "bg-white text-slate-600 border-slate-300 hover:border-green-500"
                }`}
              >
                BVN
              </button>

              <button
                type="button"
                onClick={() => {
                  setKycType("nin");
                  setVerified(false);
                  setMessage("");
                  setError("");
                }}
                className={`rounded-xl py-3 font-semibold border transition ${
                  kycType === "nin"
                    ? "bg-[#06285c] text-white border-[#06285c]"
                    : "bg-white text-slate-600 border-slate-300 hover:border-green-500"
                }`}
              >
                NIN
              </button>

            </div>

            {error && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                {message}
              </div>
            )}

            {!verified ? (
              <form onSubmit={handleVerify}>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {kycType.toUpperCase()} Number
                </label>

                <div className="relative">
                  <CreditCard
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={11}
                    value={kycNumber}
                    onChange={(e) =>
                      setKycNumber(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder={`Enter your 11-digit ${kycType.toUpperCase()}`}
                    className="w-full border border-slate-300 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Use only the test BVN/NIN created in
                  the NIBSS Phoenix simulator.
                </p>

                <button
                  disabled={loading}
                  className="w-full bg-[#06285c] hover:bg-[#041e47] text-white py-3.5 rounded-xl font-semibold mt-7 transition disabled:opacity-60"
                >
                  {loading
                    ? "Verifying..."
                    : `Verify ${kycType.toUpperCase()}`}
                </button>

              </form>
            ) : (
              <div className="text-center py-4">

                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <BadgeCheck
                    className="text-green-600"
                    size={34}
                  />
                </div>

                <h2 className="text-xl font-bold text-[#06285c]">
                  Identity verified
                </h2>

                <p className="text-slate-500 mt-2">
                  Your KYC is complete. You can now
                  create your NASDigital Bank account.
                </p>

                <button
                  onClick={handleCreateAccount}
                  disabled={creatingAccount}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-semibold mt-7 transition disabled:opacity-60"
                >
                  {creatingAccount
                    ? "Creating bank account..."
                    : "Create Bank Account"}
                </button>

              </div>
            )}

          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Your identity details are used only for this
            simulated banking project.
          </p>

        </div>
      </main>
    </div>
  );
}

export default KYC;