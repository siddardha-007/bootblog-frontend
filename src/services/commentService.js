import axios from "axios";

const API_BASE_URL = "https://bootblog-backend.onrender.com/api/comments";

// Helper to get authorization headers dynamically
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/**
 * PUT: Update an existing comment text string
 * Endpoint: PUT http://localhost:8080/api/comments/{commentId}
 */
export const updateComment = async (commentId, commentData) => {
  return await axios.put(
    `${API_BASE_URL}/${commentId}`,
    commentData,
    getAuthHeaders(),
  );
};

/**
 * DELETE: Permanently remove a comment from a post
 * Endpoint: DELETE http://localhost:8080/api/comments/{commentId}
 */
export const deleteComment = async (commentId) => {
  return await axios.delete(`${API_BASE_URL}/${commentId}`, getAuthHeaders());
};
