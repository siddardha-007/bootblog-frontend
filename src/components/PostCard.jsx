import React from "react";
import { useNavigate } from "react-router-dom";

function PostCard({ post }) {
  const navigate = useNavigate();

  // Helper function to format the ISO date string beautifully
  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Safely force UTC interpretation if the string lacks a timezone offset trailing descriptor
    const cleanStr =
      dateString.endsWith("Z") || dateString.includes("+")
        ? dateString
        : `${dateString}Z`;
    const date = new Date(cleanStr);

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Kolkata", // Forces Indian Standard Time
    });
  };

  const handleAuthorClick = (e) => {
    // Prevents click from bubbling up and opening the article route instead of the profile
    e.stopPropagation();
    navigate(`/user/${post.userId}`);
  };

  // FIXED: Converts HTML strings cleanly into plain, structured summary text for safe line clamping
  const cleanSnippet = post?.content
    ? post.content.replace(/<[^>]*>/g, "").trim()
    : "";

  return (
    <div
      onClick={() => navigate(`/posts/${post.postId}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md w-full flex flex-col"
    >
      {/* Top Section: Banner Image */}
      <div className="relative h-64 w-full overflow-hidden bg-linear-to-br from-[#193224] to-[#102a1c] shrink-0">
        {post?.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post?.title || "Post banner"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center opacity-60">
            <svg
              className="h-14 w-16 text-[#6db33f]/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {post?.categoryName && (
          <span className="absolute bottom-4 left-4 rounded-md bg-white/95 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#102a1c] backdrop-blur-sm shadow-md border border-emerald-900/10">
            {post.categoryName}
          </span>
        )}
      </div>

      {/* Bottom Section: Text Viewports */}
      <div className="p-6 flex flex-col justify-between grow">
        <div>
          {/* Author & Date metadata row */}
          <div className="flex items-center gap-3 mb-2.5 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <span
                onClick={handleAuthorClick}
                className="text-gray-700 font-semibold uppercase tracking-wider hover:text-[#5ea134] transition-colors"
              >
                {post?.username || "Anonymous"}
              </span>
            </div>

            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
              <span>{formatDate(post?.createdAt)}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-[#5ea134] transition-colors duration-200 line-clamp-2">
            {post?.title || "Untitled Post"}
          </h2>

          {/* FIXED: Elements strip tags completely & apply word break properties directly */}
          <p
            style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
            className="text-sm sm:text-base leading-relaxed text-gray-600 mb-4 line-clamp-3 whitespace-normal"
          >
            {cleanSnippet || "No summary layout available for this post."}
          </p>
        </div>

        {/* Card Footer Line */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-sm font-semibold text-[#5ea134] group-hover:underline">
          <span>Read full article →</span>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
