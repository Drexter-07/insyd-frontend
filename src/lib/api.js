// src/lib/api.js
import axios from "axios";

// Ensure your backend is running and this URL is correct
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Your backend's base URL
});
// --- User-related API calls ---

// Fetches a single user's profile by their ID
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    throw error; // Re-throw to be handled by the component
  }
};

// Fetches all users, now passing a filters object as query parameters
export const getAllUsers = async (filters = {}) => {
  try {
    // The `params` option in axios automatically converts the object
    // into a URL query string, e.g., /users?currentUserId=1
    const response = await apiClient.get("/users", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

// --- Content-related API calls ---

// Fetches all articles and jobs and combines them into a single feed
export const getCombinedFeed = async (filters = {}) => {
  try {
    const response = await apiClient.get("/feed", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch combined feed:", error);
    throw error;
  }
};

// --- NEW FUNCTION TO ADD ---
// Fetches the combined feed for a SINGLE user (for the profile page)
export const getFeedByUserId = async (userId, currentUserId) => {
  try {
    const response = await apiClient.get(`/feed/${userId}`, {
      params: { currentUserId },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch feed for user ${userId}:`, error);
    throw error;
  }
};

// Sends a generic event to the backend (for likes, follows, etc.)
export const postEvent = async (eventData) => {
  try {
    const response = await apiClient.post("/events", eventData);
    return response.data;
  } catch (error) {
    console.error("Failed to post event:", error);
    throw error; // Re-throw to be handled by the component
  }
};

export const getNotifications = async (userId) => {
  try {
    const response = await apiClient.get(`/notifications/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch notifications for user ${userId}:`, error);
    throw error;
  }
};

// MarkNotification read
export const markNotificationsRead = async (userId) => {
  try {
    const response = await apiClient.post(`/notifications/${userId}/mark-read`);
    return response.data;
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
    throw error;
  }
};

export const createArticle = async (articleData) => {
  try {
    // Corresponds to your POST /posts route
    const response = await apiClient.post("/posts", articleData);
    return response.data;
  } catch (error) {
    console.error("Failed to create article:", error);
    throw error;
  }
};

// Creates a new job posting
export const createJob = async (jobData) => {
  try {
    // Corresponds to your POST /jobs route
    const response = await apiClient.post("/jobs", jobData);
    return response.data;
  } catch (error) {
    console.error("Failed to create job:", error);
    throw error;
  }
};

// Fetches all comments for a specific article
export const getCommentsForArticle = async (articleId, currentUserId) => {
  try {
    // Corresponds to GET /articles/:articleId/comments
    const response = await apiClient.get(`/articles/${articleId}/comments`, {
      params: { currentUserId },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch comments for article ${articleId}:`, error);
    throw error;
  }
};

// Creates a new comment on an article
export const createComment = async (commentData) => {
  try {
    // Corresponds to POST /comments
    const response = await apiClient.post("/comments", commentData);
    return response.data;
  } catch (error) {
    console.error("Failed to create comment:", error);
    throw error;
  }
};
