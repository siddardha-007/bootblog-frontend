import api from "./api"; // Imported from your centralized configuration file

// const API_URL = "https://bootblog-backend.onrender.com/api/categories";

export const getAllCategories = async () => {
  // You can delete the manual token retrieval because api.js handles it automatically now!
  
  // Use 'api' and a relative path because the base URL is already managed inside api.js
  return api.get("/categories"); 
};