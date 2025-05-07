import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import UserService from "../services/userService";

function ProfileEditPage() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState("");

  // Profile data state
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    profilePicture: "",
    bio: "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete account confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate("/login?redirect=profile/edit");
      return;
    }

    // Load user data
    const userId = currentUser?._id || currentUser?.id;
    if (userId) {
      setProfileData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        profilePicture: currentUser.profilePicture || "",
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser, isAuthenticated, navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUpdateSuccess(false);

    try {
      setLoading(true);
      const userId = currentUser?._id || currentUser?.id;
      await UserService.updateProfile(userId, profileData);
      setUpdateSuccess(true);

      // Update the profile data in localStorage
      const updatedUser = {
        ...currentUser,
        ...profileData,
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Show success message
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Profile update error:", err);
      if (err.response?.status === 409) {
        setError("Username or email already taken by another user");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUpdateSuccess(false);

    // Validate password match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const userId = currentUser?._id || currentUser?.id;
      await UserService.changePassword(userId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setUpdateSuccess(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Show success message
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Password change error:", err);
      if (err.response?.status === 401) {
        setError("Current password is incorrect");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Validate the confirmation text
    if (deleteConfirmation !== currentUser.username) {
      setError(
        "Please type your username correctly to confirm account deletion"
      );
      return;
    }

    try {
      setLoading(true);
      const userId = currentUser?._id || currentUser?.id;
      await UserService.deleteAccount(userId);

      // Log the user out
      logout();

      // Redirect to home page with a message
      navigate("/?deleted=true");
    } catch (err) {
      console.error("Account deletion error:", err);
      setError("Failed to delete account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Edit Profile</h4>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {updateSuccess && (
                <div className="alert alert-success">
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleProfileSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="profilePicture" className="form-label">
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="profilePicture"
                    name="profilePicture"
                    value={profileData.profilePicture}
                    onChange={handleProfileChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  {profileData.profilePicture && (
                    <div className="mt-2">
                      <img
                        src={profileData.profilePicture}
                        alt="Profile Preview"
                        className="img-thumbnail"
                        style={{ maxHeight: "100px" }}
                      />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="bio" className="form-label">
                    Bio
                  </label>
                  <textarea
                    className="form-control"
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    rows="3"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Profile"}
                </button>
              </form>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-secondary text-white">
              <h4 className="mb-0">Change Password</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          </div>

          <div className="card mb-4 border-danger">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">Delete Account</h4>
            </div>
            <div className="card-body">
              <p className="mb-3 text-danger">
                Warning: This action cannot be undone. All your data will be
                permanently deleted.
              </p>

              {!showDeleteConfirmation ? (
                <button
                  className="btn btn-outline-danger"
                  onClick={() => setShowDeleteConfirmation(true)}
                >
                  I want to delete my account
                </button>
              ) : (
                <div>
                  <p>
                    To confirm, please type your username{" "}
                    <strong>{currentUser.username}</strong> below:
                  </p>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your username to confirm"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-danger"
                      onClick={handleDeleteAccount}
                      disabled={
                        loading || deleteConfirmation !== currentUser.username
                      }
                    >
                      {loading
                        ? "Deleting..."
                        : "Permanently Delete My Account"}
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setShowDeleteConfirmation(false);
                        setDeleteConfirmation("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditPage;
