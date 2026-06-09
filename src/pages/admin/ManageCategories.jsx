import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/adminService";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // States to handle asynchronous deletion cycles smoothly
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    loadCategories();
  }, []);

  const showToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage({ text: "", type: "" }), 4000);
  };

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCategories();
      setCategories(response?.data?.categories || response?.data || []);
    } catch (error) {
      console.error("Failed to load category list taxonomies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      showToast("Please enter a category name", "error");
      return;
    }

    try {
      setIsActionLoading(true);
      const response = await createCategory({
        categoryName: newCategory.trim(),
      });

      const addedItem = response?.data?.category || response?.data;
      if (addedItem) {
        setCategories((prev) => [...prev, addedItem]);
      } else {
        await loadCategories();
      }

      setNewCategory("");
      showToast("Category created successfully", "success");
    } catch (error) {
      console.error("Category creation failure scenario:", error);
      showToast("Failed to create category", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.categoryId);
    setEditingName(category.categoryName);
    setCategoryIdToDelete(null); // Clear active deletions if editing starts
  };

  const handleUpdate = async () => {
    if (!editingName.trim()) {
      showToast("Category name cannot be empty", "error");
      return;
    }

    try {
      setIsActionLoading(true);
      await updateCategory(editingId, {
        categoryName: editingName.trim(),
      });

      setCategories((prev) =>
        prev.map((cat) =>
          cat.categoryId === editingId
            ? { ...cat, categoryName: editingName.trim() }
            : cat,
        ),
      );

      setEditingId(null);
      setEditingName("");
      showToast("Category updated successfully", "success");
    } catch (error) {
      console.error("Category patch update lifecycle fault:", error);
      showToast("Failed to update category", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryIdToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCategory(categoryIdToDelete);
      setCategories((prev) =>
        prev.filter((cat) => cat.categoryId !== categoryIdToDelete),
      );
      showToast("Category deleted successfully", "success");
    } catch (error) {
      console.error("Category destruction execution fault:", error);
      showToast("Failed to delete category", "error");
    } finally {
      setIsDeleting(false);
      setCategoryIdToDelete(null);
    }
  };

  return (
    <div className="bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] min-h-screen pb-24 relative">
      <Navbar />

      {/* Dynamic Visual Toast Notification System */}
      {toastMessage.text && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl border font-bold text-xs shadow-md animate-fade-in transition-all ${
            toastMessage.type === "error"
              ? "bg-red-50 text-red-800 border-red-100"
              : "bg-emerald-50 text-emerald-800 border-emerald-100"
          }`}
        >
          <span>{toastMessage.type === "error" ? "⚠️" : "✨"}</span>
          {toastMessage.text}
        </div>
      )}

      <div className="max-w-5xl mx-auto p-6">
        {/* Module Header Segment */}
        <div className="mb-8 relative flex flex-col gap-2.5">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Manage Categories
            <span className="text-xs font-bold uppercase tracking-widest bg-emerald-900 text-white px-2.5 py-1 rounded-md ml-3 align-middle">
              Taxonomy Desk
            </span>
          </h1>
          <div className="w-20 h-1 bg-[#5ea134] rounded-full"></div>
        </div>

        {/* Creation Input Section */}
        <div className="flex flex-wrap gap-3 mb-8 items-center w-full">
          <input
            type="text"
            placeholder="Enter new category label..."
            value={newCategory}
            disabled={isActionLoading}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
            className="bg-white text-gray-900 font-medium text-sm rounded-xl border border-emerald-900/10 p-3 w-full sm:w-80 focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 focus:border-[#5ea134] placeholder-gray-400 shadow-3xs transition-all duration-200 disabled:opacity-60"
          />
          <button
            onClick={handleCreateCategory}
            disabled={isActionLoading}
            className="px-5 py-3 bg-[#5ea134] hover:bg-[#4c8529] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer h-11.5 flex items-center justify-center min-w-35"
          >
            {isActionLoading && !editingId ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Add Category"
            )}
          </button>
        </div>

        {/* Data Grid Canvas */}
        <div className="bg-white rounded-2xl shadow-xs border border-emerald-900/5 overflow-hidden w-full">
          {isLoading ? (
            <div className="p-12 space-y-4 w-full">
              <div className="h-8 bg-gray-100 rounded-xl animate-pulse w-full"></div>
              <div className="h-14 bg-gray-50 rounded-xl animate-pulse w-full"></div>
              <div className="h-14 bg-gray-50 rounded-xl animate-pulse w-full"></div>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse text-left table-fixed">
                <thead>
                  <tr className="bg-emerald-900/5 border-b border-emerald-900/10 text-xs font-black uppercase tracking-wider text-emerald-950">
                    <th className="p-4 pl-6 font-mono w-24">ID</th>
                    <th className="p-4 w-3/5">Category Name</th>
                    <th className="p-4 pr-6 text-right w-52">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                  {categories.map((category) => (
                    <tr
                      key={category.categoryId}
                      className={`transition-colors group ${
                        categoryIdToDelete === category.categoryId
                          ? "bg-red-50/30"
                          : "hover:bg-emerald-50/20"
                      }`}
                    >
                      {/* ID Row Column */}
                      <td className="p-4 pl-6 font-mono text-xs text-gray-400 font-bold group-hover:text-[#4c8529]">
                        #{category.categoryId}
                      </td>

                      {/* Title & Interactive Form Control Row Column */}
                      <td className="p-4">
                        {editingId === category.categoryId ? (
                          <input
                            type="text"
                            value={editingName}
                            disabled={isActionLoading}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleUpdate()
                            }
                            className="bg-white text-gray-900 font-bold text-sm rounded-lg border border-emerald-900/20 p-2 w-full focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/20 focus:border-[#5ea134] max-w-sm disabled:opacity-60"
                          />
                        ) : (
                          <span className="font-bold text-gray-900 tracking-tight">
                            {category.categoryName}
                          </span>
                        )}
                      </td>

                      {/* Action Interface Row Column */}
                      <td className="p-4 pr-6 text-right whitespace-nowrap">
                        {editingId === category.categoryId ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={handleUpdate}
                              disabled={isActionLoading}
                              className="text-xs font-bold text-[#4c8529] hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-[#5ea134]/20 transition-all cursor-pointer flex items-center gap-1"
                            >
                              {isActionLoading ? (
                                <div className="w-3 h-3 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                "Save"
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditingName("");
                              }}
                              disabled={isActionLoading}
                              className="text-xs font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : categoryIdToDelete === category.categoryId ? (
                          /* Inline Delete Micro Confirmation */
                          <div className="inline-flex items-center gap-1.5 bg-white p-1 rounded-xl border border-red-200 shadow-3xs animate-fade-in">
                            <span className="text-[10px] text-red-700 font-bold px-1 hidden sm:inline">
                              Confirm?
                            </span>
                            <button
                              disabled={isDeleting}
                              onClick={() => setCategoryIdToDelete(null)}
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
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleEdit(category)}
                              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                setCategoryIdToDelete(category.categoryId)
                              }
                              className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  {categories.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="p-12 text-center text-sm font-semibold text-gray-400"
                      >
                        No active content categories found in database indexes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageCategories;
