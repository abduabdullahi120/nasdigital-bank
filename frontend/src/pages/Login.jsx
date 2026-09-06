import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import api from "../services/api";
import logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#06285c] relative overflow-hidden items-center justify-center p-12">

        <div className="absolute w-96 h-96 bg-green-500/10 rounded-full -top-32 -left-32" />
        <div className="absolute w-80 h-80 bg-green-500/10 rounded-full -bottom-32 -right-20" />

        <div className="relative max-w-lg text-white">
          <img
  src={logo}
  alt="NASDigital Bank Logo"
  className="w-40 sm:w-48 object-contain"
/>

          <h1 className="text-5xl font-bold leading-tight">
            Banking made simple,
            secure and yours.
          </h1>

          <p className="mt-6 text-slate-300 text-lg leading-8">
            Manage your account, make secure transfers and
            keep track of your transactions from one place.
          </p>

          <div className="flex gap-8 mt-12">
            <div>
              <p className="text-2xl font-bold text-green-400">
                Simple
              </p>
              <p className="text-sm text-slate-400">
                Easy banking
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-green-400">
                Secure
              </p>
              <p className="text-sm text-slate-400">
                Protected access
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-green-400">
                Yours
              </p>
              <p className="text-sm text-slate-400">
                Personal banking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LOGIN SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 sm:px-10 py-10">

        <div className="w-full max-w-md">

          {/* MOBILE BRAND */}
          <div className="lg:hidden mb-10">
            <p className="text-[#06285c] text-2xl font-extrabold">
              NAS<span className="text-green-600">DIGITAL</span>
            </p>
            <p className="text-xs tracking-[4px] text-slate-500">
              BANK
            </p>
          </div>

          <div className="mb-8">
            <p className="text-green-600 font-semibold text-sm mb-2">
              WELCOME BACK
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#06285c]">
              Sign in to your account
            </h2>

            <p className="text-slate-500 mt-3">
              Enter your details to access your NASDigital
              Bank account.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full border border-slate-300 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full border border-slate-300 rounded-xl py-3.5 pl-12 pr-12 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#06285c] hover:bg-[#041e47] text-white rounded-xl py-3.5 font-semibold transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          <p className="text-center text-slate-500 mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-600 font-semibold hover:text-green-700"
            >
              Create account
            </Link>
          </p>

          <p className="text-center text-xs text-slate-400 mt-10">
            Simple. Secure. Yours.
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;