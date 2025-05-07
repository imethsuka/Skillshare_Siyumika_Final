import api from "./api";

const CommentService = {
  addComment: (postId, commentData) => {
    return api.post(`/comments`, {
      ...commentData,
      referenceType: "POST",
      referenceId: postId,
    });
  },
  updateComment: (commentId, commentData) => {
    return api.put(`/comments/${commentId}`, commentData);
  },
  deleteComment: (commentId) => {
    console.log(`Sending delete request for comment ID: ${commentId}`);
    return api.delete(`/comments/${commentId}`);
  },
  getCommentsByReference: (referenceType, referenceId) => {
    return api.get(`/comments/references?referenceType=${referenceType}&referenceId=${referenceId}`);
  },
};

export default CommentService;