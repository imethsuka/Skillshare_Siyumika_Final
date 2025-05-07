// src/services/userService.js
import api from "./api";
import axios from "axios";

const UserService = {
  register: (userData) => {
    return api.post("/users/register", userData);
  },

  login: async (credentials) => {
    try {
      console.log("Login request payload:", credentials);
      const response = await api.post("/users/login", credentials);
      console.log("Login response:", response.data);
      return response;
    } catch (error) {
      console.error("Login service error:", error.response || error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    return api.get("/users/me");
  },

  updateProfile: (userId, userData) => {
    return api.put(`/users/${userId}`, userData);
  },

  getUserProfile: (userId) => {
    return api.get(`/users/${userId}`);
  },

  getUserByUsername: (username) => {
    return api.get(`/users/username/${username}`);
  },

  getUserPosts: (userId) => {
    return api.get(`/users/${userId}/posts`);
  },

  deleteAccount: (userId) => {
    return api.delete(`/users/${userId}`);
  },

  changePassword: (userId, passwordData) => {
    return api.put(`/users/${userId}/change-password`, passwordData);
  },
};

export default UserService;
