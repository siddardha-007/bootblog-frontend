import axios from "axios";

const API_BASE_URL = "https://bootblog-backend.onrender.com/api/auth";

// Helper function to extract and normalize your backend's mixed error formats
const handleAxiosError = (error) => {
  let errorMessage = "An unexpected connection error occurred.";
  let validationErrors = null;

  if (error.response) {
    const data = error.response.data;

    if (typeof data === "string") {
      // Handles: "Email already exists..." or "Something went wrong"
      errorMessage = data;
    } else if (typeof data === "object" && data !== null) {
      // Handles validation maps: { "email": "Email is required" }
      validationErrors = data;
      // Grab the first validation message as a fallback summary
      errorMessage = Object.values(data)[0] || "Validation failed.";
    }
  } else if (error.request) {
    errorMessage =
      "Server is unreachable. Please check if your backend is running.";
  }

  // Return a clean, standardized error structure for our components
  return Promise.reject({
    message: errorMessage,
    fields: validationErrors, // Will contain { email: "..." } or null
    status: error.response?.status || 500,
  });
};

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, loginData);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const registerUser = async (registerData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, registerData);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};
