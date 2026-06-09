import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllPosts,
  getPostsByCategory,
  searchPosts,
} from "../services/postService";
import Navbar from "../components/NavBar";
import PostCard from "../components/PostCard";
import { getAllCategories } from "../services/categoryService";
import SidebarCarousel from "../components/SidebarCarousel";

function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // ✨ Track real-time API operational cycles
  const [isFeedLoading, setIsFeedLoading] = useState(true);

  // Unified controller synchronization
  useEffect(() => {
    if (keyword) {
      fetchSearchResults();
    } else {
      loadContent(page, selectedCategory);
    }
  }, [page, selectedCategory, keyword]);

  // Initial load for master classification records
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response?.data?.categories || response?.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const fetchSearchResults = async () => {
    try {
      setIsFeedLoading(true); // Switch loading state on
      const response = await searchPosts(keyword);
      setPosts(response.data.posts || []);
      setTotalPages(1); 
    } catch (error) {
      console.error(error);
    } finally {
      setIsFeedLoading(false); // Disable animation frames smoothly
    }
  };

  const loadContent = async (targetPage, categoryId) => {
    try {
      setIsFeedLoading(true); // Switch loading state on
      let response;
      if (categoryId !== null) {
        response = await getPostsByCategory(categoryId, targetPage);
      } else {
        response = await getAllPosts(targetPage);
      }

      if (response?.data) {
        setPosts(response.data.posts || []);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (error) {
      console.error("Error loading content feed:", error);
    } finally {
      setIsFeedLoading(false); // Disable animation frames smoothly
    }
  };

  const handleCategoryClick = (categoryId) => {
    setPage(0);
    setSelectedCategory(categoryId);
    navigate("/home"); 
  };

  const handleAllPosts = () => {
    setPage(0);
    setSelectedCategory(null);
    navigate("/home"); 
  };

  // ✨ HELPER: Structural placeholder cards mimicking your PostCard's scale
  const renderSkeletonFeed = () => (
    <div className="flex flex-col gap-10 w-full animate-pulse">
      {[1, 2, 3].map((num) => (
        <div key={num} className="bg-white/70 rounded-3xl p-6 border border-emerald-950/5 space-y-4 shadow-xs">
          <div className="flex justify-between items-center">
            <div className="h-6 w-24 bg-emerald-800/10 rounded-lg"></div>
            <div className="h-4 w-16 bg-gray-200 rounded-sm"></div>
          </div>
          <div className="h-7 w-3/4 bg-gray-300/80 rounded-xl mt-2"></div>
          <div className="space-y-2 pt-1">
            <div className="h-4 w-full bg-gray-200/80 rounded-md"></div>
            <div className="h-4 w-5/6 bg-gray-200/80 rounded-md"></div>
          </div>
          <div className="pt-4 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-800/10"></div>
            <div className="h-4 w-28 bg-gray-200/80 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] min-h-screen pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14 items-start">
          
          {/* LEFT PANEL: Main Feed Section */}
          <main className="w-full flex flex-col">
            
            {/* Spring Page Title Header */}
            <div className="mb-10 relative flex flex-col gap-2.5">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                Latest Blogs
                {/* <span className="text-xs font-bold uppercase tracking-widest bg-[#5ea134]/10 text-[#4c8529] px-2.5 py-1 rounded-md ml-3 border border-[#5ea134]/20 align-middle">
                  Spring Edition
                </span> */}
              </h1>
              <div className="w-20 h-1 bg-[#5ea134] rounded-full shadow-sm shadow-[#5ea134]/30"></div>
            </div>

            {/* Dynamic Context Tagline */}
            {keyword && (
              <div className="mb-6 p-4 bg-white/80 backdrop-blur-xs rounded-2xl border border-emerald-900/5 w-full flex items-center justify-between">
                <p className="text-sm font-bold text-emerald-900">
                  Showing results for:{" "}
                  <span className="text-[#4c8529] font-black italic">
                    "{keyword}"
                  </span>
                </p>
                <button
                  onClick={handleAllPosts}
                  className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/70 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  Reset Feed
                </button>
              </div>
            )}

            {/* Spring Style Category Filter Pills */}
            <div className="flex flex-wrap gap-2.5 mb-10">
              <button
                onClick={handleAllPosts}
                disabled={isFeedLoading}
                className={`px-5 py-2 text-sm font-bold tracking-wide rounded-full transition-all duration-200 border ${
                  selectedCategory === null && !keyword
                    ? "bg-[#5ea134] border-[#5ea134] text-white shadow-md shadow-[#5ea134]/20"
                    : "bg-white border-emerald-900/10 text-emerald-800 hover:bg-[#e4f2e9] cursor-pointer"
                } disabled:opacity-50`}
              >
                All Posts
              </button>

              {categories?.map((category) => (
                <button
                  key={category.categoryId}
                  onClick={() => handleCategoryClick(category.categoryId)}
                  disabled={isFeedLoading}
                  className={`px-5 py-2 text-sm font-bold tracking-wide rounded-full transition-all duration-200 border ${
                    selectedCategory === category.categoryId && !keyword
                      ? "bg-[#5ea134] border-[#5ea134] text-white shadow-md shadow-[#5ea134]/20"
                      : "bg-white border-emerald-900/10 text-emerald-700 hover:bg-[#e4f2e9] hover:text-emerald-900 cursor-pointer"
                  } disabled:opacity-50`}
                >
                  {category.categoryName}
                </button>
              ))}
            </div>

            {/* Vertical Post Feed Container */}
            <div className="flex flex-col gap-10 mb-16 w-full">
              {isFeedLoading ? (
                // ✨ Show placeholders during background operational queries
                renderSkeletonFeed()
              ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.postId} className="w-full animate-fade-in">
                    <PostCard post={post} />
                  </div>
                ))
              ) : (
                <div className="p-12 bg-white/60 rounded-3xl border border-emerald-900/5 text-center text-emerald-800/60 font-semibold shadow-xs w-full">
                  No matching articles could be located on this channel feed.
                </div>
              )}
            </div>

            {/* Pagination Deck */}
            {totalPages > 1 && !keyword && !isFeedLoading && (
              <div className="flex flex-col items-start gap-4 pt-6 border-t border-emerald-900/10 w-full mb-8">
                <div className="flex justify-center items-center gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-4 py-2 bg-white border border-emerald-900/10 rounded-xl shadow-xs font-semibold text-emerald-800 hover:bg-[#e4f2e9] disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setPage(index)}
                      className={`px-4 py-2 rounded-xl font-semibold shadow-xs transition-all duration-200 cursor-pointer ${
                        page === index
                          ? "bg-[#5ea134] text-white font-bold shadow-md shadow-[#5ea134]/20"
                          : "bg-white border border-emerald-900/10 text-emerald-700 hover:bg-[#e4f2e9]"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    disabled={page === totalPages - 1}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-white border border-emerald-900/10 rounded-xl shadow-xs font-semibold text-emerald-800 hover:bg-[#e4f2e9] disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
                  >
                    Next
                  </button>
                </div>

                <p className="text-xs font-bold text-emerald-700/60 tracking-wide uppercase pl-1">
                  Page {page + 1} of {totalPages}
                </p>
              </div>
            )}
          </main>

          {/* RIGHT PANEL: Fixed Sidebar Carousel */}
          <aside className="col-span-1 w-full h-full hidden lg:flex lg:items-center lg:sticky lg:top-0 lg:h-screen pb-10">
            <SidebarCarousel />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Home;