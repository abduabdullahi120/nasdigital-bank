import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  User,
  LockKeyhole,
} from "lucide-react";
import api from "../services/api";
import logo from "../assets/logo.png";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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
      const response = await api.post(
        "/auth/register",
        form
      );

      if (response.data.token) {
        localStorage.setItem(
          "token",
          response.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        navigate("/kyc");
      } else {
        navigate("/login");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-slate-300 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* BRAND PANEL */}
      <div className="hidden lg:flex lg:w-[42%] bg-[#06285c] items-center justify-center p-12 relative overflow-hidden">

        <div className="absolute w-96 h-96 bg-green-500/10 rounded-full -top-32 -right-20" />

        <div className="relative text-white max-w-md">
          <p className="text-green-400 font-semibold mb-4">
            NASDIGITAL BANK
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Your digital banking journey starts here.
          </h1>

          <p className="text-slate-300 mt-6 leading-7">
            Create your account, verify your identity and
            start managing your money securely.
          </p>

          <div className="mt-10 border-l-2 border-green-500 pl-5">
            <p className="font-semibold">
              Simple. Secure. Yours.
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="w-full lg:w-[58%] flex justify-center px-5 sm:px-10 py-10 lg:py-14">

        <div className="w-full max-w-xl">

          <div className="lg:hidden mb-8">
            <p className="text-[#06285c] text-2xl font-extrabold">
              NAS<span className="text-green-600">DIGITAL</span>
            </p>
            <p className="text-xs tracking-[4px] text-slate-500">
              BANK
            </p>
          </div>

          <p className="text-green-600 font-semibold text-sm">
            GET STARTED
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#06285c] mt-2">
            Create your account
          </h2>

          <p className="text-slate-500 mt-3 mb-8">
            Enter your personal information to open your
            NASDigital Bank profile.
          </p>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  First name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    placeholder="First name"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Last name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Last name"
                    className={inputClass}
                  />
                </div>
              </div>

            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone number
              </label>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="08012345678"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Create a password"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#06285c] hover:bg-[#041e47] text-white rounded-xl py-3.5 font-semibold transition disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          <p className="text-center text-slate-500 mt-7">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 font-semibold"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;