import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import UserService from "../services/userService";
import LearningProgressService from "../services/LearningProgressService";
import PostService from "../services/postService";

function ProfilePage() {
  const { username } = useParams();
  const { currentUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [learningProgress, setLearningProgress] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("progress");
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    step: "initial",
    authStatus: false,
    userId: null,
    error: null,
  });

  // Add console log to check when component renders
  console.log("ProfilePage rendering", { 
    profile, 
    learningProgress, 
    posts, 
    loading, 
    error, 
    debugInfo 
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setDebugInfo((prev) => ({
          ...prev,
          step: "started fetching",
          authStatus: isAuthenticated,
        }));

        let userId;
        let checkOwnProfile = false;

        if (username) {
          // Fetch user by username
          try {
            setDebugInfo((prev) => ({
              ...prev,
              step: "fetching by username",
              username,
            }));
            const userResponse = await UserService.getUserByUsername(username);
            console.log("User response:", userResponse);
            userId = userResponse.data._id || userResponse.data.id;
            setDebugInfo((prev) => ({
              ...prev,
              step: "got user by username",
              userId,
            }));

            // Check if this is the current user's profile
            checkOwnProfile =
              isAuthenticated &&
              currentUser &&
              (currentUser._id === userId || currentUser.id === userId);
          } catch (err) {
            console.error("Error fetching user by username:", err);
            setDebugInfo((prev) => ({
              ...prev,
              step: "username fetch failed",
              error: err.response?.data?.message || err.message,
            }));
            setError("User not found");
            setLoading(false);
            return;
          }
        } else if (isAuthenticated && currentUser) {
          // This is the current user's profile
          userId = currentUser._id || currentUser.id;
          setDebugInfo((prev) => ({ ...prev, step: "using current user", userId }));
          checkOwnProfile = true;
        } else {
          setDebugInfo((prev) => ({
            ...prev,
            step: "auth check failed - no current user",
          }));
        }

        // Set the isOwnProfile state
        setIsOwnProfile(checkOwnProfile);
        setDebugInfo((prev) => ({
          ...prev,
          step: "ownership set",
          isOwnProfile: checkOwnProfile,
        }));

        if (!userId) {
          setDebugInfo((prev) => ({ ...prev, step: "no userId available" }));
          setError("User not found");
          setLoading(false);
          return;
        }

        // Fetch user profile
        try {
          setDebugInfo((prev) => ({ ...prev, step: "fetching profile" }));
          const profileResponse = await UserService.getUserProfile(userId);
          console.log("Profile response:", profileResponse);
          setProfile(profileResponse.data);
          setDebugInfo((prev) => ({
            ...prev,
            step: "profile fetched successfully",
          }));
        } catch (profileErr) {
          console.error("Error fetching profile:", profileErr);
          setDebugInfo((prev) => ({
            ...prev,
            step: "profile fetch failed",
            error: profileErr.response?.data?.message || profileErr.message,
          }));
          setError("Failed to load profile data");
          setLoading(false);
          return;
        }

        // Fetch user's learning progress
        try {
          setDebugInfo((prev) => ({ ...prev, step: "fetching learning progress" }));
          const progressResponse = await LearningProgressService.getUserProgress(
            userId
          );
          console.log("Progress response:", progressResponse);
          setLearningProgress(progressResponse.data || []);
          setDebugInfo((prev) => ({ ...prev, step: "learning progress fetched" }));
        } catch (progressErr) {
          console.warn("Could not load learning progress:", progressErr);
          setDebugInfo((prev) => ({
            ...prev,
            step: "learning progress fetch failed",
            error: progressErr.response?.data?.message || progressErr.message,
          }));
          // Continue without progress rather than failing completely
          setLearningProgress([]);
        }

        // Fetch user's posts using PostService
        try {
          setDebugInfo((prev) => ({ ...prev, step: "fetching posts" }));
          const postsResponse = await PostService.getUserPosts(userId);
          console.log("Posts response:", postsResponse);
          setPosts(postsResponse.data || []);
          setDebugInfo((prev) => ({ ...prev, step: "posts fetched" }));
        } catch (postErr) {
          console.warn("Could not load posts:", postErr);
          setDebugInfo((prev) => ({
            ...prev,
            step: "posts fetch failed",
            error: postErr.response?.data?.message || postErr.message,
          }));
          // Continue without posts rather than failing completely
          setPosts([]);
        }

        setDebugInfo((prev) => ({ ...prev, step: "all data fetched successfully" }));
        setLoading(false);
      } catch (err) {
        console.error("Profile loading error:", err);
        setDebugInfo((prev) => ({
          ...prev,
          step: "main fetch error",
          error: err.response?.data?.message || err.message,
        }));
        setError(err.response?.data?.message || "Error loading profile data");
        setLoading(false);
      }
    };

    if (isAuthenticated || username) {
      fetchProfileData();
    } else {
      setDebugInfo((prev) => ({ ...prev, step: "not authenticated and no username" }));
      setError("Please log in to view your profile");
      setLoading(false);
    }
  }, [username, currentUser, isAuthenticated]);

  // Add a safety check for loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center mt-12">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-purple-300 border-l-purple-600 animate-spin"></div>
              <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 animate-pulse"></div>
            </div>
            <div className="mt-6 text-lg font-medium text-purple-800">Loading profile data...</div>
            <p className="text-gray-500 mt-2">Please wait while we retrieve your information</p>
          </div>
        </div>
      </div>
    );
  }

  // Add more detailed error display
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-xl overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm border border-red-100">
            <div className="bg-red-50 border-b border-red-100 px-6 py-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-lg font-semibold text-red-700">Error Loading Profile</h4>
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-800 mb-4">{error}</p>
              <div className="mt-4 px-4 py-3 bg-gray-50 rounded-lg">
                <details>
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer">Debug Information</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-48">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <Link to="/" className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                ← Go back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add a more robust check for profile data
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-xl overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm border border-yellow-100">
            <div className="bg-yellow-50 border-b border-yellow-100 px-6 py-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h4 className="text-lg font-semibold text-yellow-700">Profile not found</h4>
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-800 mb-4">Profile data is missing even though fetch was successful.</p>
              <div className="mt-4 px-4 py-3 bg-gray-50 rounded-lg">
                <details>
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer">Debug Information</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-48">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <Link to="/" className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                ← Go back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add a fallback check for profile properties
  const displayUsername = profile.username || 'User';
  const displayEmail = profile.email || 'No email provided';
  const displayFollowers = profile.followers || [];
  const displayFollowing = profile.following || [];
  const displayBadges = profile.badges || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative">
              {/* Decorative top border with gradient */}
              <div className="h-2 bg-gradient-to-r from-purple-500 via-purple-400 to-indigo-600"></div>
              
              {/* Profile Picture & Basic Info */}
              <div className="px-6 py-6 text-center relative">
                {/* Small decorative elements */}
                <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-yellow-300 opacity-70 animate-pulse"></div>
                <div className="absolute top-5 right-5 h-1.5 w-1.5 rounded-full bg-purple-300 opacity-70 animate-pulse" style={{animationDelay: "0.5s"}}></div>
                
                <div className="relative inline-block">
                  {profile.profileImage ? (
                    <div className="relative mx-auto w-32 h-32 mb-4 rounded-full overflow-hidden transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
                      <img
                        src={profile.profileImage}
                        alt={displayUsername}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 rounded-full border-4 border-white opacity-40"></div>
                    </div>
                  ) : (
                    <div className="relative mx-auto w-32 h-32 mb-4 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
                      <span className="text-4xl font-bold text-white">
                        {displayUsername.charAt(0).toUpperCase()}
                      </span>
                      <div className="absolute inset-0 rounded-full border-4 border-white opacity-10"></div>
                    </div>
                  )}
                  
                  {/* Status indicator */}
                  <div className="absolute bottom-3 right-0 h-5 w-5 bg-green-400 border-4 border-white rounded-full"></div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mt-2">{displayUsername}</h3>
                <p className="text-gray-500 mb-2">{displayEmail}</p>

                {profile.bio && (
                  <div className="text-gray-600 mt-3 text-sm border-t border-gray-100 pt-3">
                    {profile.bio}
                  </div>
                )}

                {/* Followers/Following stats with enhanced design */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                  <div className="px-3 py-3 rounded-lg bg-gray-50 transition-all hover:bg-purple-50 hover:shadow-sm">
                    <h5 className="text-xl font-bold text-purple-700">{displayFollowers.length || 0}</h5>
                    <small className="text-gray-500 font-medium">Followers</small>
                  </div>
                  <div className="px-3 py-3 rounded-lg bg-gray-50 transition-all hover:bg-purple-50 hover:shadow-sm">
                    <h5 className="text-xl font-bold text-purple-700">{displayFollowing.length || 0}</h5>
                    <small className="text-gray-500 font-medium">Following</small>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-6">
                  {isOwnProfile ? (
                    <Link
                      to="/profile/edit"
                      className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow-md hover:from-purple-700 hover:to-purple-800 transition-all duration-300 hover:shadow-lg font-medium text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </Link>
                  ) : (
                    <button 
                      className={`w-full inline-flex justify-center items-center px-4 py-2.5 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg font-medium text-sm
                      ${displayFollowers.includes(currentUser?._id || currentUser?.id)
                        ? "bg-gray-100 text-purple-700 hover:bg-gray-200" 
                        : "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800"}`}
                    >
                      {displayFollowers.includes(currentUser?._id || currentUser?.id) ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                          </svg>
                          Unfollow
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          Follow
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Badges & Achievements Card */}
            <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              {/* Decorative top border with gradient */}
              <div className="h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500"></div>
              
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <h3 className="font-bold text-gray-800">Badges & Achievements</h3>
                </div>
              </div>
              
              <div className="px-6 py-5">
                {displayBadges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {displayBadges.map((badge, index) => (
                      <div
                        key={index}
                        className="group relative px-3 py-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 transition-all duration-300 cursor-help"
                        title={badge.description}
                      >
                        <div className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 mr-2"></span>
                          <span className="font-medium text-sm text-purple-700">{badge.name}</span>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute left-0 bottom-full mb-2 w-48 rounded-lg bg-white shadow-lg py-2 px-3 text-xs text-gray-600 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
                          {badge.description}
                          <div className="absolute left-4 bottom-0 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-1">No badges earned yet</p>
                    <p className="text-sm text-gray-400">Complete learning paths to earn badges</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              {/* Tabs Navigation */}
              <div className="border-b border-gray-100">
                <div className="flex">
                  <button
                    className={`relative px-6 py-4 text-sm font-medium focus:outline-none transition-all duration-300
                    ${activeTab === "progress" 
                      ? "text-purple-700 hover:text-purple-800" 
                      : "text-gray-500 hover:text-gray-800"}`}
                    onClick={() => setActiveTab("progress")}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Learning Progress
                    </div>
                    {activeTab === "progress" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-purple-700"></div>}
                  </button>
                  <button
                    className={`relative px-6 py-4 text-sm font-medium focus:outline-none transition-all duration-300
                    ${activeTab === "posts" 
                      ? "text-purple-700 hover:text-purple-800" 
                      : "text-gray-500 hover:text-gray-800"}`}
                    onClick={() => setActiveTab("posts")}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      Posts
                    </div>
                    {activeTab === "posts" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-purple-700"></div>}
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="px-6 py-6">
                {activeTab === "progress" && (
                  <div>
                    <div className="flex items-center mb-6">
                      <h4 className="text-xl font-bold text-gray-800">Learning Progress</h4>
                      <div className="ml-auto">
                        {isOwnProfile && (
                          <Link to="/learning-paths" className="inline-flex items-center px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg transition-all hover:bg-purple-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Find Paths
                          </Link>
                        )}
                      </div>
                    </div>

                    {learningProgress.length > 0 ? (
                      <div className="space-y-4">
                        {learningProgress.map((progress) => (
                          <Link
                            key={progress._id || progress.id}
                            to={`/learning-progress/${progress._id || progress.id}`}
                            className="block group"
                          >
                            <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-5 py-4 transition-all duration-300 group-hover:shadow-md group-hover:border-purple-100 group-hover:bg-purple-50/30">
                              <div className="flex flex-wrap justify-between items-start mb-2">
                                <h5 className="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                                  {progress.learningPath?.title || "Learning Path"}
                                </h5>
                                <div className="flex items-center bg-gray-100 group-hover:bg-white rounded-full px-3 py-1 text-xs font-medium text-gray-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>
                                    {progress.updatedAt 
                                      ? new Date(progress.updatedAt).toLocaleDateString() 
                                      : "No date"}
                                  </span>
                                </div>
                              </div>

                              <div className="relative pt-1 mb-3">
                                <div className="overflow-hidden h-2 flex rounded-full bg-gray-200">
                                  <div 
                                    className={`transition-all duration-1000 ease-out rounded-full ${
                                      progress.progressPercentage > 75 ? "bg-green-500" :
                                      progress.progressPercentage > 40 ? "bg-blue-500" :
                                      "bg-purple-500"
                                    }`}
                                    style={{ width: `${progress.progressPercentage || 0}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-xs font-semibold text-gray-600">Progress</span>
                                  <span className="text-xs font-bold text-purple-700">{progress.progressPercentage || 0}%</span>
                                </div>
                              </div>

                              <div className="flex items-center text-sm text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>
                                  Completed {progress.completedMilestones?.length || 0} of{" "}
                                  {progress.learningPath?.milestones?.length || 0} milestones
                                </span>
                                
                                <div className="ml-auto">
                                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 group-hover:bg-purple-200 transition-colors">
                                    Continue Learning
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <p className="text-gray-600 mb-3 text-lg font-medium">No learning progress tracked yet</p>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start your learning journey by following a learning path</p>
                        
                        {isOwnProfile && (
                          <Link to="/learning-paths" className="inline-flex items-center px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow hover:from-purple-700 hover:to-purple-800 transition-all hover:shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Start a Learning Path
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "posts" && (
                  <div>
                    <div className="flex items-center mb-6">
                      <h4 className="text-xl font-bold text-gray-800">Community Posts</h4>
                      
                      {isOwnProfile && (
                        <Link to="/posts/new" className="ml-auto inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-sm hover:from-green-600 hover:to-green-700 transition-all hover:shadow font-medium text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Create New Post
                        </Link>
                      )}
                    </div>

                    {posts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {posts.map((post) => (
                          <Link 
                            key={post._id || post.id} 
                            to={`/posts/${post._id || post.id}`}
                            className="group"
                          >
                            <div className="h-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 group-hover:shadow-md group-hover:border-purple-100">
                              {post.image && (
                                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                                  <img
                                    src={post.image}
                                    alt={post.title || "Post"}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                  />
                                </div>
                              )}
                              
                              <div className="p-5">
                                <h5 className="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors mb-2">
                                  {post.title || "Untitled Post"}
                                </h5>
                                
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
                                  {post.content || "No content"}
                                </p>
                                
                                <div className="flex items-center text-xs text-gray-500 mt-auto">
                                  <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {post.createdAt 
                                      ? new Date(post.createdAt).toLocaleDateString()
                                      : "No date"}
                                  </span>
                                  
                                  <div className="ml-auto flex items-center space-x-4">
                                    <span className="flex items-center text-rose-500">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                      </svg>
                                      {post.likes?.length || 0}
                                    </span>
                                    
                                    <span className="flex items-center text-blue-500">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                      </svg>
                                      {post.comments?.length || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                        </div>
                        <p className="text-gray-600 mb-3 text-lg font-medium">No posts yet</p>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">Share your knowledge and experience with the community</p>
                        
                        {isOwnProfile && (
                          <Link to="/posts/new" className="inline-flex items-center px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow hover:from-purple-700 hover:to-purple-800 transition-all hover:shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
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
      
      {/* Add animations for the profile page */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;
