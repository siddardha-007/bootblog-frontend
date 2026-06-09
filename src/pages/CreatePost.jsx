import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ImageGuide from "../components/ImageGuide"; // Imported slide helper component
import { getAllCategories } from "../services/categoryService";
import { createPost } from "../services/postService";

function CreatePost() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);

  // Track premium state exception handlers
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ global: null, fields: null });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Remove warning flags dynamically as user interacts with fields
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

    // FIX: Changed 'imageUrl' to 'formData.imageUrl' to target state object properly
    if (formData.imageUrl.startsWith("data:image") || formData.imageUrl.length > 500) {
      alert(
        "Oops! That image link is a bit too long or encrypted. Please check the 'How to Copy Image URL' guide right next to this form to copy a clean link!",
      );
      return;
    }
    // Client-side guard check for quick enforcement before hitting backend network streams
    if (formData.content.trim().length < 10) {
      setErrors({
        global: "Validation constraints failed.",
        fields: { content: "Content must be at least 10 characters long." },
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await createPost(formData);
      navigate("/home");
    } catch (err) {
      console.error(err);
      // Handles mixed mapping payloads perfectly from our updated service layers
      setErrors({
        global: err.fields
          ? "Please correct highlighted form constraints."
          : err.message,
        fields: err.fields, // Catches things like: { title: "Title must be between...", content: "..." }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] min-h-screen flex flex-col">
      <Navbar />

      {/* Expanded container layout with responsive grid mechanics */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        
        {/* Page Title Header */}
        <div className="mb-8 relative flex flex-col gap-2.5">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Compose Article
            {/* <span className="text-xs font-bold uppercase tracking-widest bg-[#5ea134]/10 text-[#4c8529] px-2.5 py-1 rounded-md ml-3 border border-[#5ea134]/20 align-middle">
              Spring Studio
            </span> */}
          </h1>
          <div className="w-20 h-1 bg-[#5ea134] rounded-full shadow-sm shadow-[#5ea134]/30"></div>
        </div>

        {/* Master Row Layout: Form on Left, Slide Guide Card on Right */}
        <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
          
          {/* Left Column Workspace Card Layout */}
          <div className="flex-1 w-full">
            {/* Master Global Notice Banner Box */}
            {errors.global && !errors.fields && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-2 animate-fade-in">
                <span>⚠️</span>
                <span>{errors.global}</span>
              </div>
            )}

            {/* Studio Workspace Card */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-emerald-900/5 workspace-fade w-full"
            >
              <div className="space-y-6">
                {/* Input Element: Title */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-emerald-800/70 mb-2 pl-1">
                    Blog Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    disabled={isSubmitting}
                    placeholder="Enter a catchy title..."
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-[#f2f9f4]/40 text-gray-900 font-bold text-lg rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 ${
                      errors.fields?.title
                        ? "border-red-300 focus:border-red-500 bg-red-50/10"
                        : "border-emerald-900/10 focus:border-[#5ea134]"
                    }`}
                  />
                  {errors.fields?.title && (
                    <p className="text-xs font-bold text-red-600 mt-1.5 ml-1 animate-fade-in">
                      ✨ {errors.fields.title}
                    </p>
                  )}
                </div>

                {/* Twin Grid Inputs: Category Selection & Image Cover URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-emerald-800/70 mb-2 pl-1">
                      Category Channel
                    </label>
                    <select
                      name="categoryId"
                      required
                      disabled={isSubmitting}
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#f2f9f4]/40 text-gray-900 font-semibold rounded-xl border border-emerald-900/10 focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 focus:border-[#5ea134] cursor-pointer transition-all duration-200"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-emerald-800/70 mb-2 pl-1">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      disabled={isSubmitting}
                      placeholder="https://images.unsplash.com/example"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#f2f9f4]/40 text-gray-900 font-medium rounded-xl border border-emerald-900/10 focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 focus:border-[#5ea134] placeholder-gray-400 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Input Element: Sleek Plain-Text Studio View Area */}
                <div className="flex flex-col">
                  {/* Header Row: Label & Live Character Counter Status */}
                  <div className="flex justify-between items-center mb-2 pl-1">
                    <label className="text-xs font-black uppercase tracking-wider text-emerald-800/70">
                      Article Body
                    </label>
                    <span
                      className={`text-[10px] font-mono font-bold tracking-normal transition-colors ${formData.content.length < 10 ? "text-red-500" : "text-emerald-700"}`}
                    >
                      {formData.content.length} characters (min 10)
                    </span>
                  </div>

                  {/* Textarea Input Node */}
                  <textarea
                    name="content"
                    required
                    disabled={isSubmitting}
                    rows="12"
                    placeholder="Share your technical knowledge or thoughts here..."
                    value={formData.content}
                    onChange={handleChange}
                    style={{ minHeight: "250px" }}
                    className={`w-full px-5 py-4 text-gray-900 font-medium text-base rounded-2xl border transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 tracking-wide leading-relaxed resize-y ${
                      errors.fields?.content
                        ? "border-red-300 focus:border-red-500 bg-red-50/5"
                        : "border-emerald-900/10 focus:border-[#5ea134] bg-[#f2f9f4]/20"
                    }`}
                  />

                  {/* Inline Error Message */}
                  {errors.fields?.content && (
                    <p className="text-xs font-bold text-red-600 mt-1.5 ml-1 animate-fade-in block w-full">
                      ✨ {errors.fields.content}
                    </p>
                  )}
                </div>
              </div>

              {/* Form Action Submissions Button Deck */}
              <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/home")}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#5ea134] hover:bg-[#4c8529] disabled:bg-gray-400 text-white text-sm font-bold rounded-xl shadow-md shadow-[#5ea134]/10 transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <span>Publish Post</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column Layout Wrapper: Holds the Help Slide Guide Component */}
          <div className="w-full lg:w-95 lg:sticky lg:top-10 shrink-0">
            <ImageGuide />
          </div>

        </div>
      </div>
    </div>
  );
}

export default CreatePost;