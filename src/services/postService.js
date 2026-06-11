import api from "./api"; // Your central axios instance handles the base URL and tokens!

// ❌ Completely clean out unused raw axios and old commented code strings

// 1. Normalized Exception Parser: Standardizes text messages and validation maps seamlessly
const handlePostError = (error) => {
  let errorMessage =
    "An unexpected error occurred while communicating with the data server.";
  let validationFields = null;

  if (error.response) {
    const data = error.response.data;

    if (typeof data === "string") {
      errorMessage = data;
    } else if (typeof data === "object" && data !== null) {
      validationFields = data;
      errorMessage =
        Object.values(data)[0] || "Validation parameters failed constraints.";
    }
  } else if (error.request) {
    errorMessage =
      "Network timeout. Core service engine could not be contacted.";
  }

  return Promise.reject({
    message: errorMessage,
    fields: validationFields, 
    status: error.response?.status || 500,
  });
};

// 2. Exported Service API Actions matching old return structures (Using 'api')
export const getAllPosts = async (page = 0) => {
  try {
    console.log("API CALL PAGE:", page);
    // ✅ Swapped postClient to api
    const response = await api.get(`/posts?pageNumber=${page}`);
    return { data: response.data }; 
  } catch (error) {
    return handlePostError(error);
  }
};

export const getPostsByCategory = async (categoryId, page = 0) => {
  try {
    // ✅ Swapped postClient to api
    const response = await api.get(`/categories/${categoryId}/posts?pageNumber=${page}`);
    return { data: response.data };
  } catch (error) {
    return handlePostError(error);
  }
};

export const getPostById = async (postId) => {
  try {
    // ✅ Swapped postClient to api
    const response = await api.get(`/posts/${postId}`);
    return { data: response.data };
  } catch (error) {
    return handlePostError(error);
  }
};

export const searchPosts = async (keyword) => {
  try {
    // ✅ Swapped postClient to api
    const response = await api.get(`/posts/search?keyword=${keyword}`);
    return { data: response.data };
  } catch (error) {
    return handlePostError(error);
  }
};

export const createPost = async (postData) => {
  try {
    // ✅ Swapped postClient to api
    const response = await api.post("/posts", postData);
    return { data: response.data };
  } catch (error) {
    return handlePostError(error);
  }
};

export const updatePost = async (postId, postData) => {
  try {
    // ✅ Swapped postClient to api
    const response = await api.put(`/posts/${postId}`, postData);
    return { data: response.data };
  } catch (error) {
    return handlePostError(error);
  }
};

export const deletePost = async (postId) => {
  try {
    // ✅ Swapped postClient to api
    const response = await api.delete(`/posts/${postId}`);
    return { data: response.data };
  } catch (error) {
    return handlePostError(error);
  }
};

export const createComment = async (postId, commentData) => {
  try {
    // ✅ Swapped postClient to api
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return { data: response.data };
  } catch (error) {
    return handlePostError(error);
  }
};