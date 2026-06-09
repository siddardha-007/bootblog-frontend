import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCurrentUserRole } from "../services/userService";

function Navbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlKeyword = searchParams.get("keyword");
  const [role, setRole] = useState("");

  // Keep search input synced with global URL parameter states
  const [keyword, setKeyword] = useState(urlKeyword || "");

  useEffect(() => {
    fetchRole();
  }, []);

  const fetchRole = async () => {
    try {
      const response = await getCurrentUserRole();
      setRole(response.data.role);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setKeyword(urlKeyword || "");
  }, [urlKeyword]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (keyword.trim()) {
      navigate(`/home?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setKeyword("");
    navigate("/home");
  };

  return (
    /* THEME UPGRADE: Translucent Very Light Green Glassmorphism Navbar */
    <nav className="bg-[#f2f9f4]/80 backdrop-blur-md text-gray-900 px-8 py-4 flex justify-between items-center border-b border-emerald-900/10 sticky top-0 z-50 gap-4">
      {/* Left Side: Brand Identity */}
      <div
        className="flex items-center gap-2 cursor-pointer shrink-0"
        onClick={() => navigate("/home")}
      >
        {/* Micro Spring Green Leaf Dot */}
        <div className="w-2.5 h-2.5 bg-[#5ea134] rounded-full animate-pulse shadow-xs shadow-[#5ea134]/50"></div>
        <h1 className="text-xl font-black tracking-tight text-gray-900">
          Boot<span className="text-[#5ea134]">Blog</span>
        </h1>
      </div>

      {/* Center Side: Embedded Premium Search Input Frame */}
      <form
        onSubmit={handleSearch}
        className="flex items-center relative max-w-md w-full mx-4 group"
      >
        {/* Search Glass Icon Vector Decoration */}
        <span className="absolute left-3.5 text-emerald-700/40 group-focus-within:text-[#5ea134] transition-colors duration-200">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"
            />
          </svg>
        </span>

        <input
          type="text"
          placeholder="Search articles..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full pl-10 pr-20 py-2 text-sm font-medium bg-white text-gray-900 rounded-xl border border-emerald-900/10 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 focus:border-[#5ea134] shadow-xs transition-all duration-200"
        />

        {/* Action Elements inside the Input Track */}
        <div className="absolute right-1.5 flex items-center gap-1">
          {keyword && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              title="Clear search"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="px-3 py-1 bg-[#5ea134] hover:bg-[#4c8529] text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
          >
            Find
          </button>
        </div>
      </form>

      {/* Right Side: Action Panel Cluster */}
      <div className="flex items-center gap-3 shrink-0">
        {/* UPGRADED: Conditional Admin Panel Control Access Badge */}
        {role === "ROLE_ADMIN" && (
          <button
            onClick={() => navigate("/admin")}
            className="group flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-900/10 transition-all duration-200 cursor-pointer shadow-3xs"
          >
            <svg
              className="w-3.5 h-3.5 text-amber-700 transition-transform duration-300 group-hover:rotate-12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
            Admin Control
          </button>
        )}

        {/* Create Post Button */}
        <button
          onClick={() => navigate("/create-post")}
          className="group flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#5ea134] hover:bg-[#4c8529] rounded-xl transition-all duration-200 cursor-pointer shadow-xs shadow-[#5ea134]/10"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Create Post
        </button>

        {/* Profile Button */}
        <button
          onClick={() => navigate("/profile")}
          className="group flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-[#e4f2e9] rounded-xl border border-emerald-900/5 transition-all duration-200 cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5 text-[#5ea134]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          Profile
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="group flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-500 hover:text-red-600 bg-white hover:bg-red-50 rounded-xl border border-gray-100 hover:border-red-200 transition-all duration-200 cursor-pointer shadow-xs"
        >
          <svg
            className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
            />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
