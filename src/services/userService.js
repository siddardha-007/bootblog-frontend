import axios from "axios";

const API_URL = "https://bootblog-backend.onrender.com/api/users";

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getCurrentUser = () => axios.get(`${API_URL}/me`, getHeaders());

export const updateCurrentUser = (userData) =>
  axios.put(`${API_URL}/me`, userData, getHeaders());

export const getCurrentUserPosts = () =>
  axios.get(`${API_URL}/me/posts`, getHeaders());

export const getCurrentUserComments = () =>
  axios.get(`${API_URL}/me/comments`, getHeaders());

export const getCurrentUserRole = () => {
  const token = localStorage.getItem("token");

  return axios.get("https://bootblog-backend.onrender.com/api/users/me/role", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserById = (userId) => {
  const token = localStorage.getItem("token");

  return axios.get(
    `https://bootblog-backend.onrender.com/api/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const getUserPosts = (userId) => {
  const token = localStorage.getItem("token");

  return axios.get(
    `https://bootblog-backend.onrender.com/api/users/${userId}/posts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
