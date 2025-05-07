import api from "./api";

const PlantProgressService = {
  // Get all progress entries for a user
  getUserProgress: (userId) => {
    return api.get(`/api/progress/users/${userId}`);
  },

  // Get single progress detail by ID
  getProgressDetail: (progressId) => {
    return api.get(`/api/progress/${progressId}`);
  },

  // Get progress for a specific user and plan
  getProgressByUserAndPlan: (userId, planId) => {
    return api.get(`/api/progress/users/${userId}/plans/${planId}`);
  },

  // Create new progress tracking
  createProgress: (progressData) => {
    return api.post("/api/progress", progressData);
  },

  // Complete a milestone
  completeMilestone: (progressId, milestoneId) => {
    return api.post(`/api/progress/${progressId}/milestones`, {
      milestoneId: milestoneId,
      completedAt: new Date().toISOString()
    });
  },

  // Update notes
  updateNotes: (progressId, notes) => {
    return api.put(`/api/progress/${progressId}`, {
      notes: notes
    });
  },

  // Update progress percentage
  updateProgressPercentage: (progressId) => {
    return api.put(`/api/progress/${progressId}/percentage`);
  },

  // Delete progress
  deleteProgress: (progressId) => {
    return api.delete(`/api/progress/${progressId}`);
  },

  // Like a progress
  likeProgress: (progressId) => {
    return api.put(`/api/progress/${progressId}/like`);
  },

  // Get recent progress for a user
  getRecentProgress: (userId) => {
    return api.get(`/api/progress/users/${userId}/recent`);
  }
};

export default PlantProgressService;