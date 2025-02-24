import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set Authorization token dynamically
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Global error handler
const handleError = (error) => {
  console.error("API Error:", error.response || error.message);
  return error.response?.data?.message || "Something went wrong. Please try again.";
};

// 🔹 Authentication APIs
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// 🔹 User APIs
export const getUserProfile = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// 🔹 Video APIs
export const getVideoMetadata = async (videoId) => {
  try {
    const response = await api.get(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateWatchHistory = async (userId, videoId, progress) => {
  try {
    const response = await api.post("/history/update", { userId, videoId, progress });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getWatchHistory = async (userId) => {
  try {
    const response = await api.get(`/history/${userId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// 🔹 WebSocket Setup
export const setupWebSocket = (url = "ws://localhost:5000") => {
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
  };

  return socket;
};

export default api;
