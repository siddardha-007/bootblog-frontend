import axios from "axios";

const API_URL = "https://bootblog-backend.onrender.com/api/categories";

export const getAllCategories = async () => {
  const token = localStorage.getItem("token");

  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
