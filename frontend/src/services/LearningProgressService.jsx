import api from "./api";

const LearningProgressService = {
  // Get all progress entries for a user
  getUserProgress: (userId) => {
    return api.get(`/progress/users/${userId}`);
  },

  // Get single progress detail by ID
  getProgressDetail: (progressId) => {
    return api.get(`/progress/${progressId}`);
  },

  // Get progress for a specific user and learning path
  getProgressByUserAndPath: (userId, pathId) => {
    return api.get(`/progress/users/${userId}/paths/${pathId}`);
  },

  // Create new progress tracking
  createProgress: (progressData) => {
    return api.post("/progress", progressData);
  },
  
  // Start tracking progress for a path
  startProgress: (pathId) => {
    return api.post("/progress", {
      learningPathId: pathId,
      startedAt: new Date().toISOString()
    });
  },

  // Complete a milestone
  completeMilestone: (progressId, milestoneId) => {
    return api.post(`/progress/${progressId}/milestones`, {
      milestoneId: milestoneId,
      completedAt: new Date().toISOString()
    });
  },

  // Update notes
  updateNotes: (progressId, notes) => {
    return api.put(`/progress/${progressId}`, {
      notes: notes
    });
  },

  // Update progress percentage
  updateProgressPercentage: (progressId) => {
    return api.put(`/progress/${progressId}/percentage`);
  },

  // Delete progress
  deleteProgress: (progressId) => {
    return api.delete(`/progress/${progressId}`);
  },

  // Like a progress
  likeProgress: (progressId) => {
    return api.put(`/progress/${progressId}/like`);
  },

  // Get recent progress for a user
  getRecentProgress: (userId) => {
    return api.get(`/progress/users/${userId}/recent`);
  }
};

export default LearningProgressService;