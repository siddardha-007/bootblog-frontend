import { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import {
  getAllPosts,
  searchPosts,
  deletePost,
} from "../../services/adminService";

function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // States to track state transitions during row actions safely
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    loadPosts(page);
  }, [page]);

  const showToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage({ text: "", type: "" }), 4000);
  };

  const loadPosts = async (currentPage = 0) => {
    try {
      setIsLoading(true);
      const response = await getAllPosts(currentPage);
      setPosts(response?.data?.posts || []);
      setTotalPages(response?.data?.totalPages || 0);
    } catch (error) {
      console.error("Failed to load post repositories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      setIsSearching(false);
      loadPosts(page);
      return;
    }

    try {
      setIsLoading(true);
      const response = await searchPosts(searchKeyword);
      setPosts(response?.data?.posts || []);
      setTotalPages(0);
      setIsSearching(true);
    } catch (error) {
      console.error("Search criteria execution failure:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!postIdToDelete) return;

    try {
      setIsDeleting(true);
      await deletePost(postIdToDelete);
      setPosts((prev) => prev.filter((post) => post.postId !== postIdToDelete));
      showToast("Post removed from index maps permanently", "success");
    } catch (error) {
      console.error("Error invoking deletion lifecycle hook:", error);
      showToast("System error: Deletion sequence failed", "error");
    } finally {
      setIsDeleting(false);
      setPostIdToDelete(null);
    }
  };

  return (
    <div className="bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] min-h-screen pb-24 relative">
      <Navbar />

      {/* Dynamic Non-blocking Success/Error Banner Toast Notification */}
      {toastMessage.text && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl border font-bold text-xs shadow-md animate-fade-in transition-all ${
          toastMessage.type === "error" 
            ? "bg-red-50 text-red-800 border-red-100" 
            : "bg-emerald-50 text-emerald-800 border-emerald-100"
        }`}>
          <span>{toastMessage.type === "error" ? "⚠️" : "✨"}</span>
          {toastMessage.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        
        {/* Module Header Title Block */}
        <div className="mb-8 relative flex flex-col gap-2.5">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Manage Posts
            <span className="text-xs font-bold uppercase tracking-widest bg-emerald-900 text-white px-2.5 py-1 rounded-md ml-3 align-middle">
              Content Ledger
            </span>
          </h1>
          <div className="w-20 h-1 bg-[#5ea134] rounded-full"></div>
        </div>

        {/* Search Filtration Dashboard Controls */}
        <div className="flex flex-wrap gap-3 mb-6 items-center w-full">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search post titles or keywords..."
            className="bg-white text-gray-900 font-medium text-sm rounded-xl border border-emerald-900/10 p-3 w-full sm:w-80 focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 focus:border-[#5ea134] placeholder-gray-400 shadow-3xs transition-all duration-200"
          />

          <button
            onClick={handleSearch}
            className="px-5 py-3 bg-[#5ea134] hover:bg-[#4c8529] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer h-11.5"
          >
            Search
          </button>

          {isSearching && (
            <button
              onClick={() => {
                setSearchKeyword("");
                setIsSearching(false);
                loadPosts(0);
                setPage(0);
              }}
              className="px-5 py-3 bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer h-11.5"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Posts Master Table Canvas */}
        <div className="bg-white rounded-2xl shadow-xs border border-emerald-900/5 overflow-hidden w-full">
          {isLoading ? (
            <div className="p-12 space-y-4 w-full">
              <div className="h-8 bg-gray-100 rounded-xl animate-pulse w-full"></div>
              <div className="h-14 bg-gray-50 rounded-xl animate-pulse w-full"></div>
              <div className="h-14 bg-gray-50 rounded-xl animate-pulse w-full"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center text-sm font-semibold text-gray-400">
              No matching records matching criteria mapped in database indexes.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse text-left table-fixed">
                <thead>
                  <tr className="bg-emerald-900/5 border-b border-emerald-900/10 text-xs font-black uppercase tracking-wider text-emerald-950">
                    <th className="p-4 pl-6 font-mono w-20">ID</th>
                    <th className="p-4 w-2/5">Article Title</th>
                    <th className="p-4 w-1/5">Author</th>
                    <th className="p-4 w-1/5">Category</th>
                    <th className="p-4 pr-6 text-right w-44">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                  {posts.map((post) => (
                    <tr
                      key={post.postId}
                      className={`transition-colors group ${
                        postIdToDelete === post.postId 
                          ? "bg-red-50/30" 
                          : "hover:bg-emerald-50/20"
                      }`}
                    >
                      {/* Post ID */}
                      <td className="p-4 pl-6 font-mono text-xs text-gray-400 font-bold group-hover:text-[#4c8529]">
                        #{post.postId}
                      </td>

                      {/* Post Title */}
                      <td className="p-4 font-bold text-gray-900 truncate">
                        {post.title}
                      </td>

                      {/* Author */}
                      <td className="p-4 text-gray-500 truncate">
                        {post.username || (
                          <span className="text-xs text-gray-300 italic">Anonymous</span>
                        )}
                      </td>

                      {/* Category Label */}
                      <td className="p-4">
                        {post.categoryName ? (
                          <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-[#4c8529] px-2.5 py-1 rounded-md border border-[#5ea134]/10">
                            {post.categoryName}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300 italic font-normal">None</span>
                        )}
                      </td>

                      {/* Refactored Delete Action Viewport Module */}
                      <td className="p-4 pr-6 text-right">
                        {postIdToDelete === post.postId ? (
                          <div className="inline-flex items-center gap-1.5 bg-white p-1 rounded-xl border border-red-200 shadow-3xs animate-fade-in">
                            <span className="text-[10px] text-red-700 font-bold px-1.5 hidden sm:inline">
                              Confirm?
                            </span>
                            <button
                              disabled={isDeleting}
                              onClick={() => setPostIdToDelete(null)}
                              className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                            >
                              No
                            </button>
                            <button
                              disabled={isDeleting}
                              onClick={handleDelete}
                              className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer transition-all flex items-center justify-center min-w-12"
                            >
                              {isDeleting ? (
                                <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                "Yes"
                              )}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setPostIdToDelete(post.postId)}
                            className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Global Pagination Controls Layer */}
        {!isSearching && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 w-full">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-3.5 py-2 text-xs font-bold text-emerald-900 bg-white border border-emerald-900/10 hover:border-[#5ea134]/30 rounded-xl disabled:opacity-40 disabled:pointer-events-none transition-all shadow-3xs cursor-pointer"
            >
              Previous
            </button>

            <div className="flex gap-1.5 items-center">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  className={`w-9 h-9 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    page === index
                      ? "bg-[#5ea134] text-white shadow-xs shadow-[#5ea134]/20"
                      : "bg-white text-gray-600 border border-emerald-900/10 hover:border-[#5ea134]/30"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              disabled={page === totalPages - 1}
              onClick={() => setPage(page + 1)}
              className="px-3.5 py-2 text-xs font-bold text-emerald-900 bg-white border border-emerald-900/10 hover:border-[#5ea134]/30 rounded-xl disabled:opacity-40 disabled:pointer-events-none transition-all shadow-3xs cursor-pointer"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default ManagePosts;