import axios from "axios";

const API_USERS = "https://bootblog-backend.onrender.com/api/users";
const API_POSTS = "https://bootblog-backend.onrender.com/api/posts";
const API_CATEGORIES = "https://bootblog-backend.onrender.com/api/categories";

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* USERS */

export const getAllUsers = () => axios.get(`${API_USERS}/all`, getHeaders());

/* POSTS */

export const getAllPosts = (page = 0) =>
  axios.get(`${API_POSTS}?pageNumber=${page}`, getHeaders());

export const searchPosts = (keyword) =>
  axios.get(`${API_POSTS}/search?keyword=${keyword}`, getHeaders());

export const deletePost = (postId) =>
  axios.delete(`${API_POSTS}/${postId}`, getHeaders());

/* CATEGORIES */

export const getAllCategories = () => axios.get(API_CATEGORIES, getHeaders());

export const createCategory = (categoryData) =>
  axios.post(API_CATEGORIES, categoryData, getHeaders());

export const updateCategory = (categoryId, categoryData) =>
  axios.put(`${API_CATEGORIES}/${categoryId}`, categoryData, getHeaders());

export const deleteCategory = (categoryId) =>
  axios.delete(`${API_CATEGORIES}/${categoryId}`, getHeaders());
