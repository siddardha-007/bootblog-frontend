import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getUserById, getUserPosts } from "../services/userService";

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track backend runtime server exceptions (like 500 crashes)
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      // 1. Fetch data components concurrently to reduce UI waterfall strain
      const [userResponse, postsResponse] = await Promise.all([
        getUserById(userId),
        getUserPosts(userId),
      ]);

      setUser(userResponse.data);
      setPosts(postsResponse.data.posts || []);
    } catch (error) {
      console.error("Error loading user profile channels:", error);
      // Capture standard message strings parsed out by handlePostError interceptor
      setErrorMessage(
        error.message ||
          "The data engine encountered an internal 500 error processing this feed.",
      );
    } finally {
      // ✨ FIXED: This ensures loading always exits, breaking the infinite spinner trap
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Force UTC interpretation if the string lacks a timezone offset
    const cleanStr =
      dateString.endsWith("Z") || dateString.includes("+")
        ? dateString
        : `${dateString}Z`;
    const date = new Date(cleanStr);

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Kolkata", // Locks it to Indian Standard Time
    });
  };

  // Error boundary display view layout card
  if (errorMessage) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 md:p-8 text-center border border-red-100 shadow-xl shadow-red-900/5 animate-fade-in">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-xl mx-auto mb-4 font-bold border border-red-100">
              ⚠️
            </div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight mb-2">
              Profile Unreachable
            </h2>
            <p className="text-xs font-medium text-gray-500 leading-relaxed mb-6">
              {errorMessage}
            </p>
            <Link
              to="/home"
              className="inline-block px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all"
            >
              Return to Feed Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#5ea134] border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-sm font-black uppercase tracking-wider text-emerald-800/60">
            Loading Profile...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] flex flex-col">
      <Navbar />

      {/* Main Structural Layout Wrapper */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 space-y-8">
        {/* User Info Header Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-emerald-900/5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#5ea134]"></div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#5ea134]/10 text-[#4c8529] px-2.5 py-1 rounded-md border border-[#5ea134]/20">
                Author Profile
              </span>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight pt-2">
                {user?.username}
              </h1>
            </div>

            <div className="bg-[#f2f9f4]/60 px-4 py-2 rounded-xl border border-emerald-900/5 self-start sm:self-center">
              <span className="block text-xl font-black text-emerald-900 leading-none">
                {posts.length}
              </span>
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                Total Publications
              </span>
            </div>
          </div>
        </div>

        {/* User Posts Section Container */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pl-1">
            <div className="w-1.5 h-4 bg-[#5ea134] rounded-full"></div>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">
              Publications by {user?.username}
            </h2>
          </div>

          {posts.length === 0 ? (
            <div className="p-12 bg-white/60 rounded-3xl border border-emerald-900/5 text-center text-emerald-800/60 font-semibold shadow-xs">
              No articles have been uploaded by this user yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...posts].reverse().map((post) => (
                <div
                  key={post.postId}
                  onClick={() => navigate(`/posts/${post.postId}`)}
                  className="bg-white rounded-2xl p-5 border border-emerald-900/5 shadow-xs cursor-pointer hover:border-[#5ea134]/30 hover:shadow-md hover:shadow-[#5ea134]/5 flex flex-col justify-between transition-all duration-200 group"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight group-hover:text-[#4c8529] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-3">
                      {post.content?.replace(/<[^>]*>/g, "").substring(0, 120)}
                      ...
                    </p>
                  </div>

                  {/* Meta Details Row Container */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-50 text-[11px] font-bold">
                    <span className="bg-gray-50 text-emerald-800 px-2.5 py-1 rounded-md border border-gray-100 uppercase tracking-wide">
                      {post.categoryName || "Uncategorized"}
                    </span>

                    <span className="text-gray-400 font-mono">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
