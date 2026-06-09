import axios from "axios";

const API_BASE_URL = "https://bootblog-backend.onrender.com/api";

// 1. Create an isolated Axios client instance for clean modular requests
const postClient = axios.create({
  baseURL: API_BASE_URL,
});

// 2. Request Interceptor: Automatically injects your Bearer Token if it exists in local storage
postClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 3. Normalized Exception Parser: Standardizes text messages and validation maps seamlessly
const handlePostError = (error) => {
  let errorMessage =
    "An unexpected error occurred while communicating with the data server.";
  let validationFields = null;

  if (error.response) {
    const data = error.response.data;

    if (typeof data === "string") {
      // Handles raw text errors like: "Category with id 7 is not found"
      errorMessage = data;
    } else if (typeof data === "object" && data !== null) {
      // Handles validation mappings like: { title: "Title must be between 3 and 100 characters" }
      validationFields = data;
      // Extract the first validation message text as a global fallback summary string
      errorMessage =
        Object.values(data)[0] || "Validation parameters failed constraints.";
    }
  } else if (error.request) {
    errorMessage =
      "Network timeout. Core service engine could not be contacted.";
  }

  return Promise.reject({
    message: errorMessage,
    fields: validationFields, // Available if your backend passes an error object map
    status: error.response?.status || 500,
  });
};

// 4. Exported Service API Actions matching old return structures
export const getAllPosts = async (page = 0) => {
  try {
    console.log("API CALL PAGE:", page);
    const response = await postClient.get(`/posts?pageNumber=${page}`);
    return { data: response.data }; // Wrapped in { data } to keep home page happy
  } catch (error) {
    return handlePostError(error);
  }
};

export const getPostsByCategory = async (categoryId, page = 0) => {
  try {
    const response = await postClient.get(
      `/categories/${categoryId}/posts?pageNumber=${page}`,
    );
    return { data: response.data };
  } catch (error) {
    return handlePostError(error);
  }
};

export const getPostById = async (postId) => {
  try {
    const response = await postClient.get(`/posts/${postId}`);
    return { data: response.data };
  } catch (error) {
    return handlePostError(error);
  }
};

export const searchPosts = async (keyword) => {
  try {
    const response = await postClient.get(`/posts/search?keyword=${keyword}`);
    return { data: response.data };
  } catch (error) {
    return handlePostError(error);
  }
};

export const createPost = async (postData) => {
  try {
    const response = await postClient.post("/posts", postData);
    return { data: response.data };
  } catch (error) {
    return handlePostError(error);
  }
};

export const updatePost = async (postId, postData) => {
  try {
    const response = await postClient.put(`/posts/${postId}`, postData);
    return { data: response.data };
  } catch (error) {
    return handlePostError(error);
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await postClient.delete(`/posts/${postId}`);
    return { data: response.data };
  } catch (error) {
    return handlePostError(error);
  }
};

export const createComment = async (postId, commentData) => {
  try {
    const response = await postClient.post(
      `/posts/${postId}/comments`,
      commentData,
    );
    return { data: response.data };
  } catch (error) {
    return handlePostError(error);
  }
};
