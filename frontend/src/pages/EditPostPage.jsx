import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import PostService from "../services/postService";

function EditPostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    tags: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Fetch post data
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await PostService.getPostById(postId);
        const postData = response.data;

        // Check if user is the author
        const isAuthor = isAuthenticated && currentUser && (
          (currentUser._id === postData.userId || currentUser.id === postData.userId) ||
          (postData.author && (currentUser._id === postData.author._id || currentUser.id === postData.author._id))
        );

        if (!isAuthor) {
          // Redirect if user is not the author
          setError("You don't have permission to edit this post");
          setTimeout(() => navigate(`/posts/${postId}`), 2000);
          return;
        }

        // Set form data
        setFormData({
          title: postData.title || "",
          content: postData.content || "",
          image: postData.image || "",
          tags: Array.isArray(postData.tags) ? postData.tags.join(", ") : ""
        });
        
        // Set preview image if it exists
        if (postData.image) {
          setPreviewImage(postData.image);
        }
        
        setPost(postData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post. " + (err.response?.data?.message || "Please try again."));
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, isAuthenticated, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Update preview image when image URL changes
    if (name === "image" && value) {
      setImageLoading(true);
      setPreviewImage(value);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    // Keep the preview image URL but display an error state
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Process tags from comma-separated string to array
      const processedData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };
      
      await PostService.updatePost(postId, processedData);
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error("Error updating post:", err);
      setError("Failed to update post. " + (err.response?.data?.message || "Please try again."));
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <p className="text-center mt-3">Loading post data...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card border-0 shadow-sm">
            <div className="card-header py-3 bg-primary text-white d-flex justify-content-between align-items-center">
              <h2 className="h4 mb-0">
                <i className="bi bi-pencil-square me-2"></i> 
                Edit Post
              </h2>
              <div>
                <button 
                  type="button" 
                  className="btn btn-outline-light btn-sm me-2"
                  onClick={togglePreview}
                >
                  <i className={`bi ${showPreview ? 'bi-pencil' : 'bi-eye'} me-1`}></i>
                  {showPreview ? 'Edit' : 'Preview'}
                </button>
                <Link to={`/posts/${postId}`} className="btn btn-light btn-sm">
                  <i className="bi bi-x-lg me-1"></i>
                  Cancel
                </Link>
              </div>
            </div>
            
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}
              
              {showPreview ? (
                <div className="post-preview">
                  <h1 className="mb-4">{formData.title}</h1>
                  
                  {previewImage && (
                    <div className="mb-4 position-relative">
                      {imageLoading && (
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading image...</span>
                          </div>
                        </div>
                      )}
                      <img 
                        src={previewImage} 
                        alt={formData.title} 
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "400px", objectFit: "contain", width: "100%" }} 
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    </div>
                  )}
                  
                  <div className="mb-4">
                    {formData.content.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="lead">{paragraph}</p>
                    ))}
                  </div>
                  
                  {formData.tags && (
                    <div className="mb-4">
                      {formData.tags.split(',').map((tag, idx) => (
                        <span key={idx} className="badge bg-secondary me-2 py-2 px-3">
                          <i className="bi bi-tag-fill me-1"></i>
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={togglePreview}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Return to Edit
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-check-lg me-1"></i>
                      {isSubmitting ? "Saving Changes..." : "Save & Publish"}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="title" className="form-label fw-bold">Post Title *</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter an attention-grabbing title"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="image" className="form-label fw-bold">Featured Image</label>
                    <input
                      type="url"
                      className="form-control"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/your-image.jpg"
                    />
                    <small className="text-muted">
                      Enter a URL for an image that represents your post (optional)
                    </small>
                    
                    {previewImage && (
                      <div className="mt-2 position-relative" style={{ maxHeight: "200px", overflow: "hidden" }}>
                        {imageLoading && (
                          <div className="position-absolute top-50 start-50 translate-middle">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading image...</span>
                            </div>
                          </div>
                        )}
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="img-thumbnail" 
                          style={{ maxHeight: "200px", objectFit: "contain" }}
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="content" className="form-label fw-bold">Post Content *</label>
                    <textarea
                      className="form-control"
                      id="content"
                      name="content"
                      rows="10"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Share your thoughts, knowledge or experience..."
                      required
                    ></textarea>
                    <small className="text-muted">
                      Use line breaks to separate paragraphs
                    </small>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="tags" className="form-label fw-bold">Tags</label>
                    <input
                      type="text"
                      className="form-control"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="JavaScript, Web Development, Tutorial"
                    />
                    <small className="text-muted">
                      Enter comma-separated tags to categorize your post and make it more discoverable (optional)
                    </small>
                  </div>
                  
                  <div className="d-flex gap-2 mt-4 pt-3 border-top">
                    <Link to={`/posts/${postId}`} className="btn btn-outline-secondary">
                      <i className="bi bi-x me-1"></i>
                      Cancel
                    </Link>
                    <button 
                      type="button" 
                      className="btn btn-info text-white"
                      onClick={togglePreview}
                    >
                      <i className="bi bi-eye me-1"></i>
                      Preview
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary ms-auto"
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-check-lg me-1"></i>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          <div className="card mt-4 border-0 shadow-sm bg-light">
            <div className="card-body p-4">
              <h5>
                <i className="bi bi-lightbulb-fill text-warning me-2"></i>
                Editing Tips
              </h5>
              <ul className="mb-0">
                <li>Use a clear and descriptive title</li>
                <li>Break your content into paragraphs for readability</li>
                <li>Add relevant tags to help others find your post</li>
                <li>Use the preview feature to see how your post will look</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPostPage;