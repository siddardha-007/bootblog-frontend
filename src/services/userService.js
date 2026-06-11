import api from "./api"; // Import your central client instance

// ❌ DELETED: import axios from "axios";
// ❌ DELETED: const API_URL = "https://bootblog-backend.onrender.com/api/users";
// ❌ DELETED: const getHeaders = () => { ... }

export const getCurrentUser = () => {
  return api.get("/users/me");
};

export const updateCurrentUser = (userData) => {
  return api.put("/users/me", userData);
};

export const getCurrentUserPosts = () => {
  return api.get("/users/me/posts");
};

export const getCurrentUserComments = () => {
  return api.get("/users/me/comments");
};

export const getCurrentUserRole = () => {
  return api.get("/users/me/role");
};

export const getUserById = (userId) => {
  return api.get(`/users/${userId}`);
};

export const getUserPosts = (userId) => {
  return api.get(`/users/${userId}/posts`);
};