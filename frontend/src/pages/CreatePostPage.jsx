import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import PostService from "../services/postService";

function CreatePostPage() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    tags: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Move navigation to useEffect
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // If not authenticated, don't render the form
  if (!isAuthenticated) {
    return null; // Return null during initial render, useEffect will handle redirect
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      
      const response = await PostService.createPost(processedData);
      console.log("Post created response:", response.data);
      
      // Check if we got a valid post ID back
      if (response.data && response.data._id) {
        navigate(`/posts/${response.data._id}`);
      } else {
        // Navigate to the posts list if we don't have a valid post ID
        setError("Post was created but couldn't retrieve its details. Redirecting to posts list.");
        setTimeout(() => navigate("/posts"), 2000);
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. " + (err.response?.data?.message || "Please try again."));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">Create New Post</h2>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">Content *</label>
                  <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    rows="8"
                    value={formData.content}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <small className="text-muted">
                    Share your gardening tips, experiences, or questions with the community.
                  </small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Image URL (optional)</label>
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
                    Enter a URL to an image that illustrates your post.
                  </small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="tags" className="form-label">Tags (optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Beginner, Intermidiate, Advanced"
                  />
                  <small className="text-muted">
                    Enter comma-separated tags to help others find your post.
                  </small>
                </div>
                
                <div className="d-flex justify-content-between">
                  <Link to="/posts" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePostPage;