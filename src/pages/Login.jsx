import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { getCurrentUserRole } from "../services/userService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Track exception message & loading lifecycle states
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // FIXED 1: Initialized the missing state variable for the warning banner
  const [showWakeWarning, setShowWakeWarning] = useState(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await loginUser(formData);

      const token = response?.token || response?.data?.token;
      const userId = response?.userId || response?.data?.userId;

      if (token) localStorage.setItem("token", token);
      if (userId) localStorage.setItem("userId", userId);

      console.log("Backend Login Payload Data Check:", response);

      const roleResponse = await getCurrentUserRole();
      localStorage.setItem("role", roleResponse.data.role);

      navigate("/home");
    } catch (error) {
      console.error(error);
      if (error.message === "Something went wrong") {
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        setErrorMessage(error.message || "Invalid credentials.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] min-h-screen flex justify-center items-center p-4">
      
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-xs border border-emerald-900/5 w-full max-w-sm flex flex-col relative overflow-hidden"
      >
        
        {/* FIXED 2: Moved the alert banner inside the card form layout. It now correctly toggles via showWakeWarning */}
        {showWakeWarning && (
          <div className="mb-5 relative p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-medium text-slate-600 flex items-start gap-2 pr-8 animate-fade-in">
            <span className="text-sm mt-0.5 text-emerald-600">ℹ️</span>
            <p className="leading-relaxed">
              Initial requests may take up to 1–2 minutes as the server wakes from inactivity. Thank you for your patience.
            </p>
            <button 
              type="button"
              onClick={() => setShowWakeWarning(false)}
              className="absolute top-2.5 right-2 text-slate-400 hover:text-slate-600 font-bold text-sm px-1 cursor-pointer transition-colors"
            >
              ×
            </button>
          </div>
        )}

        <div className="text-center mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest bg-[#5ea134]/10 text-[#4c8529] px-2.5 py-1 rounded-md">
            Welcome Back
          </span>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mt-2">
            Account Login
          </h2>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2 animate-fade-in">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-emerald-900/70 mb-1.5 pl-0.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@domain.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full bg-[#f2f9f4]/40 text-gray-900 font-medium text-sm rounded-xl border border-emerald-900/10 p-3.5 focus:outline-hidden focus:border-[#5ea134] placeholder-gray-400 transition-all disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-emerald-900/70 mb-1.5 pl-0.5">
              Account Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full bg-[#f2f9f4]/40 text-gray-900 font-medium text-sm rounded-xl border border-emerald-900/10 p-3.5 focus:outline-hidden focus:border-[#5ea134] placeholder-gray-400 transition-all disabled:opacity-50"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 bg-[#5ea134] hover:bg-[#4c8529] disabled:bg-gray-400 text-white py-3 text-sm font-bold rounded-xl shadow-xs shadow-[#5ea134]/10 transition-all cursor-pointer duration-150 flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Sign In"
          )}
        </button>

        <p className="text-center text-xs font-semibold text-gray-400 mt-5">
          Don't have an account yet?
          <Link
            to="/register"
            className="text-[#5ea134] hover:underline font-bold ml-1"
          >
            Register Here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;