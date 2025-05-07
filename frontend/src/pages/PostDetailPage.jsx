import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import PostService from "../services/postService";

function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  useEffect(() => {
    // If no postId is provided, redirect to posts listing
    if (!postId || postId === 'undefined') {
      console.error("Invalid post ID:", postId);
      navigate('/posts'); // Redirect to posts list instead of showing an error
      return;
    }
    
    fetchPost();
  }, [postId, navigate]); // Include navigate in dependencies

  const fetchPost = async () => {
    if (!postId || postId === 'undefined') return;
    
    try {
      setLoading(true);
      const response = await PostService.getPostById(postId);
      
      // Check if the response data is valid
      if (!response.data) {
        throw new Error("Post not found");
      }
      
      // Ensure likes and comments arrays exist
      const postData = {
        ...response.data,
        likes: response.data.likes || [],
        comments: response.data.comments || []
      };
      
      setPost(postData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post: " + (err.response?.status === 404 ? "Post not found" : err.message));
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("You need to login to like a post");
      return;
    }

    try {
      await PostService.likePost(postId);
      
      // Update post in the state
      setPost(prevPost => {
        // Ensure prevPost.likes is an array
        const currentLikes = Array.isArray(prevPost.likes) ? prevPost.likes : [];
        const currentUserId = currentUser._id || currentUser.id;
        const alreadyLiked = currentLikes.includes(currentUserId);
        
        return {
          ...prevPost,
          likes: alreadyLiked 
            ? currentLikes.filter(id => id !== currentUserId)
            : [...currentLikes, currentUserId]
        };
      });
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!isAuthenticated) {
      alert("You need to login to comment");
      return;
    }

    try {
      setIsSubmitting(true);
      // Send the comment with reference to the post and user
      const userId = currentUser._id || currentUser.id;
      const response = await PostService.addComment(postId, { 
        content: comment,
        userId: userId
      });
      
      // Add author information to the comment for UI display
      const newComment = {
        ...response.data,
        author: {
          _id: userId,
          username: currentUser.username,
          profileImage: currentUser.profileImage
        },
        createdAt: new Date().toISOString()
      };
      
      // Update post in the state to include the new comment
      setPost(prevPost => ({
        ...prevPost,
        comments: [...(prevPost.comments || []), newComment]
      }));
      
      setComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditCommentContent(currentContent);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  const handleUpdateComment = async (commentId) => {
    if (!editCommentContent.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      const userId = currentUser._id || currentUser.id;
      // Call the update API with postId, commentId, userId and new content
      const response = await PostService.updateComment(
        postId, 
        commentId, 
        userId, 
        { content: editCommentContent }
      );
      
      console.log("Comment update response:", response);
      
      // Reset editing state immediately for better UX
      setEditingCommentId(null);
      setEditCommentContent("");
      
      // Fetch the entire post again to ensure we have the latest data
      await fetchPost();
      
    } catch (err) {
      console.error("Failed to update comment:", err);
      alert("Failed to update comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const userId = currentUser._id || currentUser.id;
      // Delete comment using postId, commentId and userId
      await PostService.deleteComment(postId, commentId, userId);
      
      // Update UI to remove the deleted comment
      setPost(prevPost => ({
        ...prevPost,
        comments: (prevPost.comments || []).filter(c => c._id !== commentId)
      }));
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment. Please try again.");
    }
  };

  // Check if user is author with proper null checks to prevent errors
  const isAuthor = isAuthenticated && currentUser && post && 
    (post.author || post.userId) && (
      (post.author && (currentUser._id === post.author._id || currentUser.id === post.author.id)) ||
      (post.userId && (currentUser._id === post.userId || currentUser.id === post.userId))
    );
  
  // Fix the isLiked calculation with a more robust approach
  let isLiked = false;
  if (isAuthenticated && currentUser && post && post.likes) {
    const currentUserId = currentUser._id || currentUser.id;
    isLiked = Array.isArray(post.likes) && post.likes.includes(currentUserId);
  }

  const handleDeletePost = async () => {
    // Check if the user is the author
    if (!isAuthor) {
      alert("You can only delete your own posts");
      return;
    }

    try {
      await PostService.deletePost(postId);
      navigate("/posts");
      alert("Post deleted successfully");
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  const confirmDelete = () => {
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const proceedWithDelete = () => {
    setShowDeleteModal(false);
    handleDeletePost();
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  if (!post) {
    return <div className="alert alert-warning mt-3">Post not found</div>;
  }
  
  // Ensure likes and comments exist
  const likes = Array.isArray(post.likes) ? post.likes : [];
  const comments = Array.isArray(post.comments) ? post.comments : [];

  return (
    <div className="container mt-4">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Delete Post</h5>
                <button type="button" className="btn-close btn-close-white" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this post? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={proceedWithDelete}>Delete Post</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/posts">Posts</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {post.title}
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm border-0 mb-4">
        {isAuthor && (
          <div className="card-header bg-light py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <span className="badge bg-success me-2">Your Post</span>
                <span className="text-muted small">You have full control over this content</span>
              </div>
              <div className="d-flex gap-2">
                <Link to={`/posts/${post._id || post.id}/edit`} className="btn btn-primary">
                  <i className="bi bi-pencil-square me-1"></i> Edit Post
                </Link>
                <button 
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  <i className="bi bi-trash me-1"></i> Delete Post
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="card-body">
          <div className="d-flex align-items-center mb-4">
            {post.author ? (
              <Link to={`/profile/${post.author._id || post.author.id}`} className="text-decoration-none">
                {post.author.profileImage ? (
                  <img 
                    src={post.author.profileImage} 
                    alt={post.author.username} 
                    className="rounded-circle me-3" 
                    width="50" 
                    height="50" 
                  />
                ) : (
                  <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3" style={{ width: "50px", height: "50px" }}>
                    {post.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
            ) : (
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3" style={{ width: "50px", height: "50px" }}>
                  <i className="bi bi-person"></i>
                </div>
                <div>
                  <span className="fw-bold">Unknown User</span>
                </div>
              </div>
            )}
            <div>
              {post.author ? (
                <Link to={`/profile/${post.author._id || post.author.id}`} className="text-decoration-none">
                  <h5 className="mb-0">{post.author.username}</h5>
                </Link>
              ) : (
                <h5 className="mb-0">Unknown User</h5>
              )}
              <small className="text-muted">
                Posted on {new Date(post.createdAt).toLocaleDateString()}
              </small>
            </div>
          </div>

          <h2 className="card-title mb-3">{post.title}</h2>
          
          {post.image && (
            <div className="post-image-container mb-4">
              <img 
                src={post.image} 
                alt={post.title} 
                className="img-fluid rounded shadow-sm" 
                style={{ maxHeight: "500px", objectFit: "contain", width: "100%" }} 
              />
            </div>
          )}
          
          <div className="post-content mb-4">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="card-text lead">
                {paragraph}
              </p>
            ))}
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="post-tags mb-4">
              {post.tags.map((tag, index) => (
                <span key={index} className="badge bg-light text-dark me-2 p-2">
                  <i className="bi bi-tag me-1"></i>
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="post-actions d-flex justify-content-between align-items-center mt-4 pt-4 border-top">
            <div className="d-flex gap-3">
              <button 
                className={`btn ${isLiked ? "btn-danger" : "btn-outline-danger"}`}
                onClick={handleLike}
                disabled={!isAuthenticated}
              >
                <i className="bi bi-heart-fill me-1"></i>
                {likes.length} {likes.length === 1 ? "Like" : "Likes"}
              </button>
              
              <button 
                className="btn btn-outline-primary"
                onClick={() => document.getElementById('commentInput').focus()}
              >
                <i className="bi bi-chat-fill me-1"></i>
                {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
              </button>
            </div>
            
            <div className="d-flex align-items-center">
              <button className="btn btn-sm btn-link text-muted" onClick={() => window.scrollTo(0, 0)}>
                <i className="bi bi-arrow-up me-1"></i>
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-light">
          <h4 className="mb-0">
            <i className="bi bi-chat-quote me-2"></i>
            Comments ({comments.length})
          </h4>
        </div>
        <div className="card-body">
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-4">
              <div className="mb-3">
                <textarea
                  id="commentInput"
                  className="form-control"
                  rows="3"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <div className="alert alert-info mb-4">
              <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to join the conversation
            </div>
          )}

          {comments.length > 0 ? (
            <div className="comment-list">
              {comments.map(comment => (
                <div key={comment._id || `temp-${Date.now()}`} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        {comment.author ? (
                          <Link to={`/profile/${comment.author._id || comment.author.id}`} className="text-decoration-none">
                            {comment.author.profileImage ? (
                              <img 
                                src={comment.author.profileImage} 
                                alt={comment.author.username} 
                                className="rounded-circle me-2" 
                                width="40" 
                                height="40" 
                              />
                            ) : (
                              <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px" }}>
                                {comment.author.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </Link>
                        ) : (
                          <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px" }}>
                            <i className="bi bi-person"></i>
                          </div>
                        )}
                        <div>
                          {comment.author ? (
                            <Link to={`/profile/${comment.author._id || comment.author.id}`} className="text-decoration-none">
                              <span className="fw-bold">{comment.author.username}</span>
                            </Link>
                          ) : (
                            <span className="fw-bold">Unknown User</span>
                          )}
                          <br />
                          <small className="text-muted">
                            {new Date(comment.createdAt || Date.now()).toLocaleString()}
                          </small>
                        </div>
                      </div>
                      
                      {(isAuthenticated && comment.author && (
                        (currentUser._id === comment.author._id) || 
                        (currentUser.id === comment.author.id) || 
                        isAuthor
                      )) && (
                        <div className="btn-group">
                          {((currentUser._id === comment.author._id) || 
                            (currentUser.id === comment.author.id)) && (
                            <button 
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => handleEditComment(comment._id, comment.content)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                          )}
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {editingCommentId === comment._id ? (
                      <div className="mt-2">
                        <textarea
                          className="form-control mb-2"
                          rows="3"
                          value={editCommentContent}
                          onChange={(e) => setEditCommentContent(e.target.value)}
                          required
                        ></textarea>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => handleUpdateComment(comment._id)}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Saving..." : "Save"}
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="card-text">{comment.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;
