import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWakeWarning, setShowWakeWarning] = useState(true); // State to control announcement visibility

  const [errors, setErrors] = useState({ global: null, fields: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors.fields?.[e.target.name]) {
      setErrors({
        ...errors,
        fields: { ...errors.fields, [e.target.name]: null },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ global: null, fields: null });

    if (formData.password !== formData.confirmPassword) {
      setErrors({
        global: "Please correct the highlighted validation errors.",
        fields: { confirmPassword: "Passwords do not match." },
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { confirmPassword, ...submitData } = formData;
      await registerUser(submitData);
      navigate("/");
    } catch (err) {
      setErrors({
        global: err.fields
          ? "Please correct the highlighted validation errors."
          : err.message,
        fields: err.fields,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] min-h-screen flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl border border-emerald-900/5 shadow-xl w-full max-w-md">
        
        {/* Styled as a clean, normal, friendly announcement notice */}
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

        <div className="mb-8 text-center flex flex-col items-center gap-2">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Create Account
          </h2>
          <div className="w-12 h-1 bg-[#5ea134] rounded-full"></div>
        </div>

        {errors.global && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2 animate-fade-in">
            <span>⚠️</span>
            <span>{errors.global}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-1.5 ml-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full bg-white text-gray-900 font-medium text-sm rounded-xl border p-3 focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 transition-all ${
                errors.fields?.username
                  ? "border-red-300 focus:border-red-500"
                  : "border-emerald-900/10 focus:border-[#5ea134]"
              }`}
            />
            {errors.fields?.username && (
              <p className="text-[11px] font-bold text-red-600 mt-1 ml-1">
                {errors.fields.username}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-1.5 ml-1">
              Email Address
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full bg-white text-gray-900 font-medium text-sm rounded-xl border p-3 focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 transition-all ${
                errors.fields?.email
                  ? "border-red-300 focus:border-red-500"
                  : "border-emerald-900/10 focus:border-[#5ea134]"
              }`}
            />
            {errors.fields?.email && (
              <p className="text-[11px] font-bold text-red-600 mt-1 ml-1">
                {errors.fields.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full bg-white text-gray-900 font-medium text-sm rounded-xl border p-3 focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 transition-all ${
                errors.fields?.password
                  ? "border-red-300 focus:border-red-500"
                  : "border-emerald-900/10 focus:border-[#5ea134]"
              }`}
            />
            {errors.fields?.password && (
              <p className="text-[11px] font-bold text-red-600 mt-1 ml-1">
                {errors.fields.password}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-1.5 ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full bg-white text-gray-900 font-medium text-sm rounded-xl border p-3 focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 transition-all ${
                errors.fields?.confirmPassword
                  ? "border-red-300 focus:border-red-500"
                  : "border-emerald-900/10 focus:border-[#5ea134]"
              }`}
            />
            {errors.fields?.confirmPassword && (
              <p className="text-[11px] font-bold text-red-600 mt-1 ml-1">
                {errors.fields.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 px-5 py-3.5 bg-[#5ea134] hover:bg-[#4c8529] disabled:bg-gray-400 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer duration-150"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wide mt-6 pt-2 border-t border-gray-100">
            Already have an account?
            <Link
              to="/"
              className="text-[#4c8529] font-black underline ml-1.5 normal-case"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;