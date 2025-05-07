import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaClock, FaTag, FaUsers, FaSearch, FaGraduationCap, FaLaptop, FaBrain, FaRegLightbulb } from 'react-icons/fa';
import LearningPathService from '../services/LearningPathService';
import LearningProgressService from '../services/LearningProgressService';
import { useAuth } from '../utils/AuthContext';

// Animation variants
const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

function LearningPathExplorer() {
  const [paths, setPaths] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [tags, setTags] = useState([]);
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        setLoading(true);
        
        let response;
        if (activeTag) {
          response = await LearningPathService.getPathsByTag(activeTag);
        } else if (searchTerm) {
          response = await LearningPathService.searchPaths(searchTerm);
        } else {
          response = await LearningPathService.getAllPaths();
        }
        
        setPaths(response.data);
        
        // Extract and count unique tags
        const tagCounts = {};
        response.data.forEach(path => {
          if (path.tags && Array.isArray(path.tags)) {
            path.tags.forEach(tag => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          }
        });
        
        // Convert to array and sort by count
        const tagArray = Object.entries(tagCounts)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10); // Take top 10 tags
          
        setTags(tagArray);

        // If user is logged in, fetch their progress
        if (isAuthenticated) {
          const progressResponse = await LearningProgressService.getUserProgress(currentUser._id || currentUser.id);
          setUserProgress(progressResponse.data);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load learning paths");
        setLoading(false);
        console.error(err);
      }
    };

    fetchPaths();
  }, [currentUser, isAuthenticated, searchTerm, activeTag]);

  const startProgress = async (pathId) => {
    try {
      const response = await LearningProgressService.startProgress(pathId);
      
      // Update the user progress state
      setUserProgress([...userProgress, response.data]);
    } catch (err) {
      console.error("Failed to start tracking progress:", err);
      alert("Failed to start tracking this learning path. Please try again.");
    }
  };

  const getFilteredPaths = () => {
    if (!isAuthenticated || filter === "all") {
      return paths;
    }

    const progressMap = new Map(
      userProgress.map(progress => [progress.learningPath._id || progress.learningPath.id, progress])
    );

    return paths.filter(path => {
      const progress = progressMap.get(path._id || path.id);
      
      if (filter === "started" && progress) {
        return progress.progressPercentage < 100;
      }
      
      if (filter === "completed" && progress) {
        return progress.progressPercentage === 100;
      }
      
      if (filter === "not-started") {
        return !progress;
      }
      
      return true;
    });
  };

  const getUserProgressForPath = (pathId) => {
    return userProgress.find(p => (p.learningPath._id || p.learningPath.id) === pathId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search term will trigger useEffect
  };

  const handleTagClick = (tag) => {
    setActiveTag(activeTag === tag ? "" : tag);
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-purple-600 to-violet-700 rounded-xl p-8 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-4">Learning Paths Explorer</h1>
        <p className="text-purple-100 mb-6">
          Discover and track educational journeys to develop your skills. Browse our collection of learning paths or create your own!
        </p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-grow">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for skills, subjects, or topics..."
                className="w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 p-2"
              >
                <FaSearch />
              </button>
            </div>
          </form>
          
          {isAuthenticated && currentUser?.role === "admin" && (
            <Link
              to="/create-path"
              className="bg-white text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-lg font-medium shadow-sm whitespace-nowrap flex items-center justify-center"
            >
              <FaRegLightbulb className="mr-2" /> Create New Path
            </Link>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTag("")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            activeTag === "" 
              ? "bg-purple-600 text-white" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        
        {tags.map(({ tag, count }) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeTag === tag 
                ? "bg-purple-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            #{tag} <span className="text-xs">({count})</span>
          </button>
        ))}
      </div>
      
      {isAuthenticated && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "all" ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setFilter("all")}
          >
            All Paths
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "started" ? "bg-violet-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setFilter("started")}
          >
            In Progress
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "completed" ? "bg-fuchsia-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "not-started" ? "bg-pink-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setFilter("not-started")}
          >
            Not Started
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariant}
        initial="hidden"
        animate="visible"
      >
        {getFilteredPaths().length > 0 ? (
          getFilteredPaths().map(path => {
            const progress = getUserProgressForPath(path._id || path.id);
            
            return (
              <motion.div
                key={path._id || path.id}
                variants={itemVariant}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                {path.image ? (
                  <img 
                    src={path.image} 
                    alt={path.title} 
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center">
                    <FaGraduationCap className="text-6xl text-white opacity-50" />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex gap-2 flex-wrap mb-3">
                    {path.tags && path.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{path.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{path.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      <span>{path.duration || "30"} days</span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="mr-1" />
                      <span>{path.usersFollowing?.length || 0} learners</span>
                    </div>
                  </div>
                  
                  {progress && (
                    <div className="mb-4">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-purple-600">
                              Progress
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-purple-600">
                              {progress.progressPercentage}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-purple-200">
                          <div 
                            style={{ width: `${progress.progressPercentage}%` }} 
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {progress.completedMilestones.length} of {path.milestones.length} milestones completed
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Link 
                      to={`/learning-paths/${path._id || path.id}`}
                      className="flex-1 bg-white border border-purple-600 text-purple-700 px-4 py-2 rounded-lg text-center hover:bg-purple-50 transition-colors"
                    >
                      View Details
                    </Link>
                    
                    {isAuthenticated && !progress && (
                      <button 
                        onClick={() => startProgress(path._id || path.id)}
                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Start Learning
                      </button>
                    )}
                    
                    {isAuthenticated && progress && (
                      <Link 
                        to={`/learning-progress/${progress._id || progress.id}`}
                        className="flex-1 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
                      >
                        Continue Learning
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center">
            <FaBrain className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No learning paths found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setActiveTag("");
                setFilter("all");
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default LearningPathExplorer;