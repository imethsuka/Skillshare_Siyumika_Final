import api from "./api";

const LearningPathService = {
  // Get all learning paths
  getAllPaths: () => {
    return api.get("/paths");
  },

  // Get a specific learning path by ID
  getPathById: (pathId) => {
    return api.get(`/paths/${pathId}`);
  },

  // Create a new learning path (admin only)
  createPath: (pathData) => {
    return api.post("/paths", pathData);
  },

  // Update a learning path (admin only)
  updatePath: (pathId, pathData) => {
    return api.put(`/paths/${pathId}`, pathData);
  },

  // Delete a learning path (admin only)
  deletePath: (pathId) => {
    return api.delete(`/paths/${pathId}`);
  },

  // Get paths by category
  getPathsByCategory: (category) => {
    return api.get(`/paths/category/${category}`);
  },

  // Search paths by keyword
  searchPaths: (title) => {
    return api.get(`/paths/search?title=${title}`);
  },
  
  // Get paths by tag
  getPathsByTag: (tag) => {
    return api.get(`/paths/tags/${tag}`);
  },
  
  // Like a path
  likePath: (pathId) => {
    return api.put(`/paths/${pathId}/like`);
  },
  
  // Get public paths
  getPublicPaths: () => {
    return api.get("/paths/public");
  },
  
  // Add milestone to a path
  addMilestone: (pathId, milestone) => {
    return api.post(`/paths/${pathId}/milestones`, milestone);
  },
  
  // Update a milestone
  updateMilestone: (pathId, milestoneId, milestone) => {
    return api.put(`/paths/${pathId}/milestones/${milestoneId}`, milestone);
  },
  
  // Remove a milestone
  removeMilestone: (pathId, milestoneId) => {
    return api.delete(`/paths/${pathId}/milestones/${milestoneId}`);
  }
};

export default LearningPathService;