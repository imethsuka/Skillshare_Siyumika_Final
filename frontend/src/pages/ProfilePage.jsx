import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import UserService from "../services/userService";
import PlantProgressService from "../services/plantProgressService";
import PostService from "../services/postService"; // Import PostService

function ProfilePage() {
  const { username } = useParams();
  const { currentUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [plantProgress, setPlantProgress] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("progress");
  const [isOwnProfile, setIsOwnProfile] = useState(false); // Add this to determine if the user is viewing their own profile

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        let userId;
        let checkOwnProfile = false;

        if (username) {
          // Fetch user by username
          try {
            const userResponse = await UserService.getUserByUsername(username);
            userId = userResponse.data._id || userResponse.data.id;
            // Check if this is the current user's profile
            checkOwnProfile =
              isAuthenticated &&
              currentUser &&
              (currentUser._id === userId || currentUser.id === userId);
          } catch (err) {
            console.error("Error fetching user by username:", err);
            setError("User not found");
            setLoading(false);
            return;
          }
        } else if (isAuthenticated && currentUser) {
          // This is the current user's profile
          userId = currentUser._id || currentUser.id;
          checkOwnProfile = true;
        }

        // Set the isOwnProfile state
        setIsOwnProfile(checkOwnProfile);

        if (!userId) {
          setError("User not found");
          setLoading(false);
          return;
        }

        // Fetch user profile
        const profileResponse = await UserService.getUserProfile(userId);
        setProfile(profileResponse.data);

        // Fetch user's plant progress
        try {
          const progressResponse = await PlantProgressService.getUserProgress(
            userId
          );
          setPlantProgress(progressResponse.data);
        } catch (progressErr) {
          console.warn("Could not load plant progress:", progressErr);
          // Continue without progress rather than failing completely
        }

        // Fetch user's posts using PostService instead of UserService
        try {
          // Use PostService's getUserPosts method instead
          const postsResponse = await PostService.getUserPosts(userId);
          setPosts(postsResponse.data);
        } catch (postErr) {
          console.warn("Could not load posts:", postErr);
          // Continue without posts rather than failing completely
          setPosts([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Profile loading error:", err);
        setError(err.response?.data?.message || "Error loading profile data");
        setLoading(false);
      }
    };

    if (isAuthenticated || username) {
      fetchProfileData();
    } else {
      setError("Please log in to view your profile");
      setLoading(false);
    }
  }, [username, currentUser, isAuthenticated]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;
  if (!profile)
    return <div className="alert alert-warning mt-3">Profile not found</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-3">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.username}
                    className="rounded-circle img-fluid"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center bg-secondary mx-auto"
                    style={{ width: "150px", height: "150px" }}
                  >
                    <span className="display-4 text-white">
                      {profile.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <h3>{profile.username}</h3>
              <p className="text-muted">{profile.email}</p>

              {profile.bio && <p>{profile.bio}</p>}

              <div className="d-flex justify-content-around mb-3">
                <div>
                  <h5>{profile.followers?.length || 0}</h5>
                  <small className="text-muted">Followers</small>
                </div>
                <div>
                  <h5>{profile.following?.length || 0}</h5>
                  <small className="text-muted">Following</small>
                </div>
              </div>

              {isOwnProfile ? (
                <div className="d-flex gap-2">
                  <Link
                    to="/profile/edit"
                    className="btn btn-outline-primary flex-grow-1"
                  >
                    Edit Profile
                  </Link>
                </div>
              ) : (
                <button className="btn btn-primary w-100">
                  {profile.followers?.includes(currentUser?._id)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">Badges & Achievements</div>
            <div className="card-body">
              {profile.badges && profile.badges.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {profile.badges.map((badge, index) => (
                    <div
                      key={index}
                      className="badge bg-success p-2"
                      title={badge.description}
                    >
                      {badge.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted">No badges earned yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "progress" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("progress")}
                  >
                    Plant Progress
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "posts" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("posts")}
                  >
                    Posts
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {activeTab === "progress" && (
                <div>
                  <h4>Plant Progress</h4>
                  {plantProgress.length > 0 ? (
                    <div className="list-group">
                      {plantProgress.map((progress) => (
                        <Link
                          key={progress._id}
                          to={`/plant-progress/${progress._id}`}
                          className="list-group-item list-group-item-action"
                        >
                          <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">
                              {progress.plantingPlan.title}
                            </h5>
                            <small>
                              {new Date(
                                progress.updatedAt
                              ).toLocaleDateString()}
                            </small>
                          </div>
                          <div className="progress mb-2">
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{
                                width: `${progress.progressPercentage}%`,
                              }}
                              aria-valuenow={progress.progressPercentage}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              {progress.progressPercentage}%
                            </div>
                          </div>
                          <p className="mb-1">
                            Completed {progress.completedMilestones.length} of{" "}
                            {progress.plantingPlan.milestones.length} milestones
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted mb-3">
                        No plant progress tracked yet
                      </p>
                      {isOwnProfile && (
                        <Link to="/planting-plans" className="btn btn-primary">
                          Start a Planting Plan
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "posts" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Posts</h4>
                    {isOwnProfile && (
                      <Link to="/posts/new" className="btn btn-success">
                        <i className="bi bi-plus-circle me-1"></i> Create New
                        Post
                      </Link>
                    )}
                  </div>

                  {posts.length > 0 ? (
                    <div className="row">
                      {posts.map((post) => (
                        <div className="col-md-6 mb-4" key={post._id}>
                          <div className="card h-100">
                            {post.image && (
                              <img
                                src={post.image}
                                className="card-img-top"
                                alt={post.title}
                              />
                            )}
                            <div className="card-body">
                              <h5 className="card-title">{post.title}</h5>
                              <p className="card-text text-truncate">
                                {post.content}
                              </p>
                              <Link
                                to={`/posts/${post._id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                Read More
                              </Link>
                            </div>
                            <div className="card-footer text-muted">
                              <small>
                                {new Date(post.createdAt).toLocaleDateString()}
                              </small>
                              <div className="float-end">
                                <i className="bi bi-heart-fill text-danger me-1"></i>{" "}
                                {post.likes?.length || 0}
                                <i className="bi bi-chat-fill text-primary ms-3 me-1"></i>{" "}
                                {post.comments?.length || 0}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted mb-3">No posts yet</p>
                      {isOwnProfile && (
                        <Link to="/posts/new" className="btn btn-primary">
                          Create a Post
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
