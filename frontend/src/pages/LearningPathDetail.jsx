import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaClock, FaHeart, FaTags, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import LearningPathService from '../services/LearningPathService';
import LearningProgressService from '../services/LearningProgressService';
import { useAuth } from '../utils/AuthContext';

function LearningPathDetail() {
  const { pathId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [path, setPath] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllMilestones, setShowAllMilestones] = useState(false);
  const [likingPath, setLikingPath] = useState(false);

  useEffect(() => {
    const fetchPathDetails = async () => {
      try {
        setLoading(true);
        const response = await LearningPathService.getPathById(pathId);
        setPath(response.data);

        // If user is logged in, check if they're already tracking this learning path
        if (isAuthenticated && currentUser) {
          try {
            const progressResponse = await LearningProgressService.getUserProgress(currentUser._id || currentUser.id);
            const userProgress = progressResponse.data.find(
              p => (p.learningPath._id || p.learningPath.id) === pathId
            );
            setProgress(userProgress || null);
          } catch (err) {
            console.error("Error fetching user progress:", err);
          }
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load learning path details");
        setLoading(false);
        console.error(err);
      }
    };

    fetchPathDetails();
  }, [pathId, currentUser, isAuthenticated]);

  const startProgress = async () => {
    try {
      setLikingPath(true);
      const response = await LearningProgressService.startProgress(pathId);
      setProgress(response.data);
      
      // Increment the likes count on the path
      await LearningPathService.likePath(pathId);
      
      // Update the path with the new like count
      setPath(prevPath => ({
        ...prevPath,
        likes: (prevPath.likes || 0) + 1
      }));
      
      setLikingPath(false);
      navigate(`/learning-progress/${response.data._id || response.data.id}`);
    } catch (err) {
      setLikingPath(false);
      console.error("Failed to start tracking progress:", err);
      alert("Failed to start tracking this learning path. Please try again.");
    }
  };

  const likePath = async () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=learning-paths/" + pathId);
      return;
    }
    
    try {
      setLikingPath(true);
      await LearningPathService.likePath(pathId);
      
      // Update the path with the new like count
      setPath(prevPath => ({
        ...prevPath,
        likes: (prevPath.likes || 0) + 1
      }));
      
      setLikingPath(false);
    } catch (err) {
      setLikingPath(false);
      console.error("Failed to like the learning path:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
          <Link to="/learning-paths" className="text-red-700 font-medium hover:underline mt-2 inline-block">
            &larr; Back to Learning Paths
          </Link>
        </div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p>Learning path not found</p>
          <Link to="/learning-paths" className="text-yellow-700 font-medium hover:underline mt-2 inline-block">
            &larr; Back to Learning Paths
          </Link>
        </div>
      </div>
    );
  }

  // Display only first 3 milestones by default, unless expanded
  const displayedMilestones = showAllMilestones 
    ? path.milestones 
    : (path.milestones || []).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6">
        <Link to="/learning-paths" className="text-purple-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Learning Paths
        </Link>
      </nav>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        {path.image ? (
          <div className="h-64 md:h-80 w-full overflow-hidden">
            <img 
              src={path.image} 
              alt={path.title} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-64 md:h-80 w-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
            <FaGraduationCap className="text-9xl text-white opacity-50" />
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {(path.categories || []).map((category, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {category}
              </span>
            ))}
            <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
              {path.difficulty || "Beginner"}
            </span>
            <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full flex items-center">
              <FaClock className="mr-1" />
              {path.duration || "30"} days
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{path.title}</h1>
          
          <p className="text-gray-700 text-lg mb-6">{path.description}</p>
          
          <div className="flex items-center gap-4 mb-6 text-gray-500">
            <div className="flex items-center">
              <FaUsers className="mr-1" />
              <span>{path.usersFollowing?.length || 0} learners</span>
            </div>
            <div className="flex items-center">
              <FaHeart className="mr-1" />
              <span>{path.likes || 0} likes</span>
            </div>
            <div className="text-sm">
              Created on {new Date(path.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          {path.requirements && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Prerequisites</h2>
              <p className="text-gray-700">{path.requirements}</p>
            </div>
          )}
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Milestones</h2>
            <div className="space-y-4">
              {displayedMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-purple-50 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-800">
                      {index + 1}. {milestone.title}
                    </h3>
                    {milestone.estimatedDays && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {milestone.estimatedDays} days
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mt-2">{milestone.description}</p>
                  {milestone.tips && (
                    <div className="mt-2 text-sm text-purple-700 italic">
                      <strong>Tip:</strong> {milestone.tips}
                    </div>
                  )}
                  {milestone.resources && milestone.resources.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700">Resources:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                        {milestone.resources.map((resource, i) => (
                          <li key={i}>{resource}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {(path.milestones || []).length > 3 && (
              <button 
                className="mt-4 flex items-center text-purple-600 hover:text-purple-800 font-medium"
                onClick={() => setShowAllMilestones(!showAllMilestones)}
              >
                {showAllMilestones ? (
                  <>
                    <FaChevronUp className="mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <FaChevronDown className="mr-1" />
                    Show All {path.milestones.length} Milestones
                  </>
                )}
              </button>
            )}
          </div>
          
          {path.tips && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Tips for Success</h3>
              <p className="text-gray-700">{path.tips}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mr-2 flex items-center">
              <FaTags className="mr-2" /> Tags:
            </h3>
            {(path.tags || []).map((tag, index) => (
              <Link 
                key={index}
                to={`/learning-paths?tag=${tag}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {isAuthenticated ? (
              progress ? (
                <Link 
                  to={`/learning-progress/${progress._id || progress.id}`}
                  className="flex-1 bg-purple-600 text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  View My Progress
                </Link>
              ) : (
                <button 
                  className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                  onClick={startProgress}
                  disabled={likingPath}
                >
                  {likingPath ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Starting...
                    </span>
                  ) : (
                    <>
                      <FaGraduationCap className="mr-2" /> Start Learning
                    </>
                  )}
                </button>
              )
            ) : (
              <Link
                to={`/login?redirect=learning-paths/${pathId}`}
                className="flex-1 bg-gray-100 text-gray-800 text-center py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Log in to track your progress
              </Link>
            )}
            
            <button 
              className="flex-1 bg-white border border-purple-600 text-purple-700 py-3 px-6 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center justify-center"
              onClick={likePath}
              disabled={likingPath}
            >
              {likingPath ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Liking...
                </span>
              ) : (
                <>
                  <FaHeart className="mr-2" /> Like This Path
                </>
              )}
            </button>
          </div>
          
          {isAuthenticated && currentUser?.role === "admin" && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-2">
                <Link 
                  to={`/learning-paths/${pathId}/edit`}
                  className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors"
                >
                  Edit Path
                </Link>
                <button
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded font-medium hover:bg-red-700 transition-colors"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this learning path?")) {
                      LearningPathService.deletePath(pathId)
                        .then(() => navigate("/learning-paths"))
                        .catch(err => console.error("Failed to delete path:", err));
                    }
                  }}
                >
                  Delete Path
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LearningPathDetail;