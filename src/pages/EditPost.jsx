import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { getAllCategories } from "../services/categoryService";
import { getPostById, updatePost } from "../services/postService";

function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tracks global and field-specific backend validation errors
  const [errors, setErrors] = useState({
    global: "",
    fields: null,
  });

  useEffect(() => {
    loadPostAndCategories();
  }, [postId]);

  const loadPostAndCategories = async () => {
    try {
      setErrors({ global: "", fields: null });
      // 1. Fetch categories for the dropdown menu
      const catResponse = await getAllCategories();
      setCategories(catResponse?.data?.categories || catResponse?.data || []);

      // 2. Fetch the existing post data from your Spring Boot API
      const postResponse = await getPostById(postId);
      if (postResponse?.data) {
        setFormData({
          title: postResponse.data.title || "",
          content: postResponse.data.content || "", 
          imageUrl: postResponse.data.imageUrl || "",
          categoryId: postResponse.data.categoryId || "",
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback redirection handled gracefully without window.alert popups
      navigate("/home");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear specific field errors dynamically when the user starts rewriting
    if (errors.fields || errors.global) {
      setErrors((prev) => ({
        global: "",
        fields: prev.fields ? { ...prev.fields, [e.target.name]: "" } : null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({ global: "", fields: null });

    // Client-side quick check fallback
    if (!formData.content.trim()) {
      setErrors({
        global: "Validation constraints failed.",
        fields: { content: "Please write some content before saving changes." }
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await updatePost(postId, formData); 
      navigate(`/posts/${postId}`); 
    } catch (error) {
      console.error(error);
      // Maps standard response payloads directly from handlePostError reject schema
      setErrors({
        global: error.message || "Failed to finalize revision changes with data engine.",
        fields: error.fields || null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#5ea134] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="w-full">
          
          {/* Header Accent block */}
          <div className="mb-8 relative flex flex-col gap-2.5">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Edit Article
              <span className="text-xs font-bold uppercase tracking-widest bg-[#5ea134]/10 text-[#4c8529] px-2.5 py-1 rounded-md ml-3 border border-[#5ea134]/20 align-middle">
                Revision Desk
              </span>
            </h1>
            <div className="w-20 h-1 bg-[#5ea134] rounded-full"></div>
          </div>

          {/* Form Frame Element Wrapper */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-emerald-900/5 w-full">
            
            {/* Global API Exception Banner Alert */}
            {errors.global && !errors.fields && (
              <div className="mb-6 p-4 bg-red-50/80 border border-red-100 rounded-2xl text-xs font-bold text-red-700 animate-fade-in flex items-center gap-2">
                ⚠️ {errors.global}
              </div>
            )}

            <div className="space-y-6">
              
              {/* Title input */}
              <div className="flex flex-col">
                <label className="block text-xs font-black uppercase tracking-wider text-emerald-800/70 mb-2 pl-1">
                  Blog Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  disabled={isSubmitting}
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-gray-900 font-bold text-lg rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 transition-all ${
                    errors.fields?.title 
                      ? "border-red-300 focus:border-red-500 bg-red-50/5" 
                      : "bg-[#f2f9f4]/40 border-emerald-900/10 focus:border-[#5ea134]"
                  }`}
                />
                {errors.fields?.title && (
                  <p className="text-xs font-bold text-red-600 mt-1.5 ml-1 animate-fade-in">
                    ✨ {errors.fields.title}
                  </p>
                )}
              </div>

              {/* Category & Image Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="block text-xs font-black uppercase tracking-wider text-emerald-800/70 mb-2 pl-1">
                    Category Channel
                  </label>
                  <select
                    name="categoryId"
                    required
                    disabled={isSubmitting}
                    value={formData.categoryId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 text-gray-900 font-semibold rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 cursor-pointer transition-all ${
                      errors.fields?.categoryId 
                        ? "border-red-300 focus:border-red-500 bg-red-50/5" 
                        : "bg-[#f2f9f4]/40 border-emerald-900/10 focus:border-[#5ea134]"
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                  {errors.fields?.categoryId && (
                    <p className="text-xs font-bold text-red-600 mt-1.5 ml-1 animate-fade-in">
                      ✨ {errors.fields.categoryId}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="block text-xs font-black uppercase tracking-wider text-emerald-800/70 mb-2 pl-1">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    disabled={isSubmitting}
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 text-gray-900 font-medium rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 transition-all ${
                      errors.fields?.imageUrl 
                        ? "border-red-300 focus:border-red-500 bg-red-50/5" 
                        : "bg-[#f2f9f4]/40 border-emerald-900/10 focus:border-[#5ea134]"
                    }`}
                  />
                  {errors.fields?.imageUrl && (
                    <p className="text-xs font-bold text-red-600 mt-1.5 ml-1 animate-fade-in">
                      ✨ {errors.fields.imageUrl}
                    </p>
                  )}
                </div>
              </div>

              {/* Input Element: Sleek Plain-Text Revision View Area */}
              <div className="flex flex-col">
                <label className="block text-xs font-black uppercase tracking-wider text-emerald-800/70 mb-2 pl-1">
                  Article Body
                </label>
                <textarea
                  name="content"
                  required
                  disabled={isSubmitting}
                  rows="12"
                  placeholder="Share your technical knowledge or thoughts here..."
                  value={formData.content}
                  onChange={handleChange}
                  style={{ minHeight: "250px" }}
                  className={`w-full px-5 py-4 text-gray-900 font-medium text-base rounded-2xl border focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 tracking-wide leading-relaxed resize-y transition-all duration-200 ${
                    errors.fields?.content 
                      ? "border-red-300 focus:border-red-500 bg-red-50/5" 
                      : "bg-[#f2f9f4]/20 border-emerald-900/10 focus:border-[#5ea134] placeholder-gray-400"
                  }`}
                />
                {errors.fields?.content && (
                  <p className="text-xs font-bold text-red-600 mt-1.5 ml-1 animate-fade-in">
                    ✨ {errors.fields.content}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-gray-100">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => navigate(`/posts/${postId}`)}
                className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#5ea134] hover:bg-[#4c8529] text-white text-sm font-bold rounded-xl shadow-md shadow-[#5ea134]/10 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-80"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  "Save Updates"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPost;