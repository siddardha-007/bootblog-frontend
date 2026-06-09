import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/NavBar";
import {
  getAllUsers,
  getAllPosts,
  getAllCategories,
} from "../../services/adminService";

function AdminDashboard() {
  const navigate = useNavigate();

  const [usersCount, setUsersCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const [usersResponse, postsResponse, categoriesResponse] = await Promise.all([
        getAllUsers(),
        getAllPosts(),
        getAllCategories(),
      ]);

      setUsersCount(usersResponse?.data?.length || 0);
      setPostsCount(postsResponse?.data?.totalElements || postsResponse?.data?.length || 0);
      setCategoriesCount(
        categoriesResponse?.data?.categories?.length || 
        categoriesResponse?.data?.length || 0
      );
    } catch (error) {
      console.error("Error aggregates loading failure:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4]">
        <Navbar />
        <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6 mt-16">
          <div className="h-32 bg-white/60 rounded-2xl animate-pulse border border-emerald-900/5"></div>
          <div className="h-32 bg-white/60 rounded-2xl animate-pulse border border-emerald-900/5"></div>
          <div className="h-32 bg-white/60 rounded-2xl animate-pulse border border-emerald-900/5"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] min-h-screen pb-24">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        {/* Dashboard Branding Header */}
        <div className="mb-10 relative flex flex-col gap-2.5">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Admin Dashboard
            <span className="text-xs font-bold uppercase tracking-widest bg-emerald-900 text-white px-2.5 py-1 rounded-md ml-3 align-middle">
              System Core
            </span>
          </h1>
          <div className="w-20 h-1 bg-[#5ea134] rounded-full"></div>
        </div>

        {/* Metrics Grid Interface */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          
          {/* Users Card Metric */}
          <div
            onClick={() => navigate("/admin/users")}
            className="bg-white p-6 rounded-2xl border border-emerald-900/5 shadow-xs cursor-pointer hover:border-[#5ea134]/30 hover:shadow-md hover:shadow-[#5ea134]/5 transition-all duration-200 flex flex-col justify-between group overflow-hidden"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-400 group-hover:text-[#4c8529] transition-colors">
                Users
              </h2>
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-4xl font-black text-gray-900 tracking-tight font-mono">
                {usersCount}
              </p>
              <span className="text-[11px] font-bold text-gray-400 mt-1 block">Manage user privileges →</span>
            </div>
          </div>

          {/* Posts Card Metric */}
          <div
            onClick={() => navigate("/admin/posts")}
            className="bg-white p-6 rounded-2xl border border-emerald-900/5 shadow-xs cursor-pointer hover:border-[#5ea134]/30 hover:shadow-md hover:shadow-[#5ea134]/5 transition-all duration-200 flex flex-col justify-between group overflow-hidden"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-400 group-hover:text-[#4c8529] transition-colors">
                Posts
              </h2>
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-4xl font-black text-gray-900 tracking-tight font-mono">
                {postsCount}
              </p>
              <span className="text-[11px] font-bold text-gray-400 mt-1 block">Audit database articles →</span>
            </div>
          </div>

          {/* Categories Card Metric */}
          <div
            onClick={() => navigate("/admin/categories")}
            className="bg-white p-6 rounded-2xl border border-emerald-900/5 shadow-xs cursor-pointer hover:border-[#5ea134]/30 hover:shadow-md hover:shadow-[#5ea134]/5 transition-all duration-200 flex flex-col justify-between group overflow-hidden"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-400 group-hover:text-[#4c8529] transition-colors">
                Categories
              </h2>
              <div className="w-8 h-8 rounded-xl bg-[#5ea134]/10 flex items-center justify-center text-[#4c8529]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-4xl font-black text-gray-900 tracking-tight font-mono">
                {categoriesCount}
              </p>
              <span className="text-[11px] font-bold text-gray-400 mt-1 block">Configure topic taxonomies →</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;