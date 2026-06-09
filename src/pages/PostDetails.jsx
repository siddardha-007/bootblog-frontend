import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, createComment } from "../services/postService";
import { updateComment, deleteComment } from "../services/commentService";
import Navbar from "../components/Navbar";

function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Tracking states for inline comment editing
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Integrated validation and deletion tracking states
  const [commentError, setCommentError] = useState(false);
  const [editCommentError, setEditCommentError] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);

  // Retrieve current logged-in email to confirm authorization rules
  const currentUserId = localStorage.getItem("userId") || "";

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const response = await getPostById(postId);
      setPost(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      setCommentError(true);
      return;
    }

    try {
      const response = await createComment(postId, {
        text: commentText,
      });

      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), response.data],
      }));

      setCommentText("");
      setCommentError(false);
    } catch (error) {
      console.error(error);
    }
  };

  const startEditingComment = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditingText(currentText);
    setEditCommentError(false);
    setCommentIdToDelete(null); // Close delete drawer if switching to edit mode
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditingText("");
    setEditCommentError(false);
  };

  const handleCommentUpdate = async (commentId) => {
    if (!editingText.trim()) {
      setEditCommentError(true);
      return;
    }

    try {
      const response = await updateComment(commentId, { text: editingText });

      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c.commentId === commentId
            ? { ...c, text: response.data.text || editingText }
            : c,
        ),
      }));

      cancelEditingComment();
    } catch (error) {
      console.error(error);
    }
  };

  const triggerDeleteConfirmation = (commentId) => {
    setCommentIdToDelete(commentId);
    cancelEditingComment(); // Close editor if switching to delete mode
  };

  const handleCommentDelete = async () => {
    if (!commentIdToDelete) return;

    try {
      await deleteComment(commentIdToDelete);

      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter(
          (c) => c.commentId !== commentIdToDelete,
        ),
      }));
      setCommentIdToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCommentDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading || !post) {
    return (
      <div className="bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 animate-pulse mt-8 flex flex-col items-center">
          <div className="w-full h-96 bg-emerald-900/5 rounded-3xl mb-6"></div>
          <div className="h-10 bg-emerald-900/10 rounded-xl w-3/4 mb-4"></div>
          <div className="h-4 bg-emerald-900/5 rounded-md w-1/3 mb-10"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] min-h-screen pb-24">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 flex flex-col items-center">
        {/* Back Link Frame */}
        <div className="w-full flex justify-start">
          <button
            onClick={() => navigate("/home")}
            className="mb-6 flex items-center gap-1 text-sm font-bold text-emerald-800 hover:text-[#5ea134] transition-colors cursor-pointer group"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Back to articles
          </button>
        </div>

        {/* Article Framework Core Layout */}
        <article className="bg-white rounded-3xl overflow-hidden shadow-xs border border-emerald-900/5 p-6 md:p-8 mb-10 w-full">
          <div className="relative h-96 w-full overflow-hidden rounded-2xl bg-linear-to-br from-[#193224] to-[#102a1c]">
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            )}
            {post.categoryName && (
              <span className="absolute bottom-4 left-4 rounded-xl bg-[#5ea134] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-md">
                {post.categoryName}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4.5xl font-black text-gray-900 tracking-tight mt-8 mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-4 text-xs sm:text-sm font-semibold text-gray-500 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <span
                onClick={() => navigate(`/user/${post.userId}`)}
                className="text-gray-900 font-bold uppercase tracking-wide cursor-pointer hover:text-[#5ea134] hover:underline"
              >
                {post.username || "Anonymous"}
              </span>
            </div>
            <span className="text-gray-200 hidden sm:inline">|</span>
            <div>{formatDate(post.createdAt)}</div>
          </div>

          <div className="w-full max-w-full overflow-hidden mt-8">
            <p
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              className="text-gray-700 font-medium text-base sm:text-lg leading-relaxed whitespace-pre-line tracking-wide pl-4 border-l-4 border-l-[#5ea134]/30"
            >
              {post.content}
            </p>
          </div>
        </article>

        {/* Discussion Board Component */}
        <div className="bg-white rounded-3xl border border-emerald-900/5 p-6 md:p-8 w-full">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6 flex items-center gap-2">
            Discussion Board
            <span className="text-xs font-black bg-[#5ea134]/10 text-[#4c8529] px-2.5 py-1 rounded-full border border-[#5ea134]/15">
              {post.comments?.length || 0}
            </span>
          </h2>

          {!post.comments || post.comments.length === 0 ? (
            <div className="p-6 bg-[#f2f9f4]/40 rounded-2xl text-center text-sm font-semibold text-emerald-800/50 border border-dashed border-emerald-900/10 mb-8">
              No responses recorded on this topic feed. Be the first to add a
              comment!
            </div>
          ) : (
            <div className="space-y-4 mb-8 w-full max-w-3xl">
              {post.comments.map((comment) => (
                <div
                  key={comment.commentId}
                  className="p-4 bg-[#f2f9f4]/30 rounded-2xl border border-emerald-900/5 shadow-2xs group/comm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-emerald-900 tracking-wider bg-white px-2 py-0.5 rounded-md border border-emerald-900/5 shadow-3xs">
                      {comment.username}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-gray-400">
                        {formatCommentDate(comment.createdAt)}
                      </span>

                      {String(comment.userId) === String(currentUserId) && (
                        <div className="flex items-center gap-2 opacity-60 group-hover/comm:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              startEditingComment(
                                comment.commentId,
                                comment.text,
                              )
                            }
                            title="Edit Comment"
                            className="text-gray-400 hover:text-emerald-700 transition-colors cursor-pointer"
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
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() =>
                              triggerDeleteConfirmation(comment.commentId)
                            }
                            title="Delete Comment"
                            className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Inline Form Edit Workflow View Layer */}
                  {editingCommentId === comment.commentId && (
                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => {
                          setEditingText(e.target.value);
                          if (editCommentError) setEditCommentError(false);
                        }}
                        className={`w-full bg-white text-gray-900 font-medium text-sm rounded-xl border p-2.5 focus:outline-hidden transition-all ${
                          editCommentError
                            ? "border-red-400 focus:border-red-500 bg-red-50/10"
                            : "border-emerald-900/20 focus:border-[#5ea134]"
                        }`}
                      />

                      {editCommentError && (
                        <p className="text-[11px] font-bold text-red-600 pl-1 animate-fade-in">
                          ✨ Comment modifications cannot be left blank.
                        </p>
                      )}

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={cancelEditingComment}
                          className="px-2.5 py-1 text-[11px] font-bold text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleCommentUpdate(comment.commentId)}
                          className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#5ea134] hover:bg-[#4c8529] rounded-lg cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Built-in Deletion Inline Warning Box */}
                  {commentIdToDelete === comment.commentId && (
                    <div className="mt-3 p-3 bg-red-50/60 border border-red-100 rounded-xl flex items-center justify-between gap-4 animate-fade-in">
                      <span className="text-xs text-red-700 font-bold">
                        ⚠️ Permanent removal action. Proceed?
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCommentIdToDelete(null)}
                          className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-gray-500 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg cursor-pointer transition-colors"
                        >
                          Abort
                        </button>
                        <button
                          onClick={handleCommentDelete}
                          className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Standard Static Comment View Mode */}
                  {editingCommentId !== comment.commentId &&
                    commentIdToDelete !== comment.commentId && (
                      <p className="text-gray-700 font-medium text-sm leading-relaxed pl-0.5 whitespace-pre-line mt-1">
                        {comment.text}
                      </p>
                    )}
                </div>
              ))}
            </div>
          )}

          {/* Submission Input Box Area */}
          <div className="pt-6 border-t border-gray-100 w-full max-w-3xl flex flex-col">
            <h3 className="text-sm font-black uppercase tracking-wider text-emerald-800/70 mb-2 pl-0.5">
              Join the conversation
            </h3>

            <textarea
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                if (commentError) setCommentError(false);
              }}
              placeholder="Share your thoughts or ask a question..."
              rows="3"
              className={`w-full text-gray-900 font-medium text-sm rounded-2xl border p-4 focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]/10 transition-all duration-200 resize-none ${
                commentError
                  ? "border-red-400 focus:border-red-500 bg-red-50/10"
                  : "bg-[#f2f9f4]/40 border-emerald-900/10 focus:border-[#5ea134]"
              }`}
            />

            {commentError && (
              <p className="text-xs font-bold text-red-600 mt-2 pl-1 animate-fade-in">
                ✨ Discussion text parameters cannot be left blank.
              </p>
            )}

            <div className="flex justify-end mt-3">
              <button
                onClick={handleCommentSubmit}
                className="px-5 py-2 bg-[#5ea134] hover:bg-[#4c8529] text-white text-xs font-bold rounded-xl shadow-xs shadow-[#5ea134]/10 transition-all cursor-pointer"
              >
                Post Response
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetails;
