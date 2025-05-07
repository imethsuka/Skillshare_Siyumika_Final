import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaBook, FaClock, FaTag, FaUsers, FaSearch, FaGraduationCap, 
  FaLaptop, FaBrain, FaRegLightbulb, FaFilter, FaArrowRight,
  FaPlus, FaCheckCircle, FaHourglassHalf, FaArrowDown, FaStar,
  FaSeedling
} from 'react-icons/fa';
import LearningPathService from '../services/LearningPathService';
import LearningProgressService from '../services/LearningProgressService';
import { useAuth } from '../utils/AuthContext';

// Import images for decorative elements
import leafIcon from '../images/progress/leaf.png';
import badgeIcon from '../images/progress/badge.png';

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
  const [filterOpen, setFilterOpen] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  
  const categories = [
    { id: 'development', name: 'Development', icon: <FaLaptop className="text-blue-500" /> },
    { id: 'design', name: 'Design', icon: <FaRegLightbulb className="text-yellow-500" /> },
    { id: 'business', name: 'Business', icon: <FaBook className="text-green-500" /> },
    { id: 'tech', name: 'Technology', icon: <FaBrain className="text-purple-500" /> },
  ];

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
      // Show loading state or disable button here if needed
      const userId = currentUser?._id || currentUser?.id;
      const response = await LearningProgressService.startProgress(pathId, userId);
      
      // Update the user progress state
      setUserProgress(prev => [...prev, response.data]);
      
      // Toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-up flex items-center';
      toast.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Learning path started! You can now track your progress.</span>
      `;
      document.body.appendChild(toast);
      
      // Remove toast after 3 seconds
      setTimeout(() => {
        toast.classList.add('animate-fade-out');
        setTimeout(() => document.body.removeChild(toast), 500);
      }, 3000);
      
    } catch (err) {
      console.error("Failed to start tracking progress:", err);
      
      // Error toast
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed bottom-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-up flex items-center';
      errorToast.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Failed to start tracking this learning path. Please try again.</span>
      `;
      document.body.appendChild(errorToast);
      
      setTimeout(() => {
        errorToast.classList.add('animate-fade-out');
        setTimeout(() => document.body.removeChild(errorToast), 500);
      }, 3000);
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
    return userProgress.find(p => {
      // First check if the learningPath exists
      if (!p || !p.learningPath) return false;
      
      // Then check for matching IDs
      return (p.learningPath._id || p.learningPath.id) === pathId;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search term will trigger useEffect
  };

  const handleTagClick = (tag) => {
    setActiveTag(activeTag === tag ? "" : tag);
    setSearchTerm("");
  };

  const getPathLevel = (path) => {
    if (!path.difficulty) {
      return "All Levels";
    }
    
    const difficulty = path.difficulty.toLowerCase();
    if (difficulty.includes("beginner")) return "Beginner";
    if (difficulty.includes("intermediate")) return "Intermediate";
    if (difficulty.includes("advanced")) return "Advanced";
    return "All Levels";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaSeedling className="text-purple-600 animate-pulse h-6 w-6" />
            </div>
          </div>
          <p className="text-purple-600 mt-4 font-medium">Loading learning paths...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-8 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        
        <img 
          src={leafIcon} 
          alt="Leaf" 
          className="absolute top-10 left-10 w-20 h-20 opacity-10 rotate-45" 
        />
        <img 
          src={badgeIcon} 
          alt="Badge" 
          className="absolute bottom-10 right-10 w-24 h-24 opacity-10" 
        />
        
        <div className="container mx-auto px-4 py-10 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-8">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Discover Learning Paths
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Structured learning journeys to help you master new skills at your own pace. 
              Track your progress, earn badges, and connect with other learners.
            </motion.p>
            
            <motion.div 
              className="max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for skills, subjects, or technologies..."
                  className="w-full pl-6 pr-14 py-4 rounded-full shadow-lg focus:ring-2 focus:ring-purple-500 focus:outline-none border border-purple-100 text-gray-700"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <FaSearch />
                </button>
              </form>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {categories.map(category => (
                <div 
                  key={category.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-purple-100 flex flex-col items-center justify-center hover:shadow-md transition-all cursor-pointer w-28 h-28"
                  onClick={() => setSearchTerm(category.name)}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    {category.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
          
          <div className="flex justify-center">
            <motion.button
              className="flex items-center text-purple-600 font-medium"
              animate={{ y: [0, 5, 0] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              onClick={() => {
                const filtersSection = document.getElementById('filters-section');
                filtersSection.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="mr-2">Explore All Paths</span>
              <FaArrowDown />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Filters Section */}
      <div id="filters-section" className="container mx-auto px-4 mb-10">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaFilter className="mr-2 text-purple-600" /> 
                Browse Learning Paths
                {getFilteredPaths().length > 0 && (
                  <span className="ml-2 text-sm bg-purple-100 text-purple-700 py-1 px-2 rounded-full">
                    {getFilteredPaths().length} path{getFilteredPaths().length !== 1 ? 's' : ''}
                  </span>
                )}
              </h2>
              
              <div className="flex items-center gap-4">
                <button 
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2 rounded-lg font-medium transition-colors flex items-center md:hidden"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <FaFilter className="mr-2" />
                  {filterOpen ? "Hide Filters" : "Show Filters"}
                </button>
                
                {isAuthenticated && currentUser?.role === "admin" && (
                  <Link
                    to="/create-path"
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-5 py-2.5 rounded-lg font-medium shadow-sm whitespace-nowrap flex items-center justify-center"
                  >
                    <FaPlus className="mr-2" /> Create New Path
                  </Link>
                )}
              </div>
            </div>
            
            <div className={`space-y-6 ${filterOpen ? 'block' : 'hidden md:block'}`}>
              {/* Tag filters */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTag("")}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      activeTag === "" 
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Topics
                  </button>
                  
                  {tags.map(({ tag, count }) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        activeTag === tag 
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      #{tag} <span className="text-xs opacity-80">({count})</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Progress filters - only for authenticated users */}
              {isAuthenticated && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Your Progress</h3>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === "all" 
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm" 
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setFilter("all")}
                    >
                      All Paths
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                        filter === "started" 
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm" 
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setFilter("started")}
                    >
                      <FaHourglassHalf className="mr-2" /> In Progress
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                        filter === "completed" 
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm" 
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setFilter("completed")}
                    >
                      <FaCheckCircle className="mr-2" /> Completed
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === "not-started" 
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm" 
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setFilter("not-started")}
                    >
                      Not Started
                    </button>
                  </div>
                </div>
              )}
              
              {/* Clear filters option */}
              {(activeTag || searchTerm || filter !== "all") && (
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setActiveTag("");
                      setFilter("all");
                    }}
                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center underline"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="container mx-auto px-4 mb-8">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Learning Paths Grid */}
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariant}
          initial="hidden"
          animate="visible"
        >
          {getFilteredPaths().length > 0 ? (
            getFilteredPaths().map(path => {
              const progress = getUserProgressForPath(path._id || path.id);
              const pathLevel = getPathLevel(path);
              
              return (
                <motion.div
                  key={path._id || path.id}
                  variants={itemVariant}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full"
                >
                  {/* Path image or placeholder */}
                  <div className="relative h-52">
                    {path.image ? (
                      <img 
                        src={path.image} 
                        alt={path.title} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                        <FaGraduationCap className="text-6xl text-white opacity-50" />
                      </div>
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Status Badge */}
                    {isAuthenticated && (
                      <div className="absolute top-3 right-3 z-10">
                        {progress ? (
                          progress.progressPercentage >= 100 ? (
                            <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center shadow-md">
                              <FaCheckCircle className="mr-1" /> Completed
                            </span>
                          ) : (
                            <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center shadow-md">
                              <FaHourglassHalf className="mr-1" /> {progress.progressPercentage}% Complete
                            </span>
                          )
                        ) : (
                          <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
                            Start Learning
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Bottom info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                      <div className="flex gap-2 flex-wrap mb-1">
                        {path.tags && path.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{path.duration || "30"} days</span>
                        </div>
                        <div className="flex items-center">
                          <FaUsers className="mr-1" />
                          <span>{path.usersFollowing?.length || "0"} learners</span>
                        </div>
                        <div className="flex items-center">
                          <FaGraduationCap className="mr-1" />
                          <span>{pathLevel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">{path.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow">{path.description}</p>
                    
                    {/* Rating and milestones */}
                    <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <div className="flex text-amber-400 mr-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < 4 ? "" : "text-gray-300"} size={14} />
                          ))}
                        </div>
                        <span className="text-xs">4.0</span>
                      </div>
                      <span>
                        {path.milestones?.length || "10"} milestones
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    {progress && (
                      <div className="mb-4">
                        <div className="relative pt-1">
                          <div className="flex mb-1 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block text-purple-600">
                                Your Progress
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-purple-600">
                                {progress.progressPercentage}%
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-1 text-xs flex rounded-full bg-purple-100">
                            <div 
                              style={{ width: `${progress.progressPercentage}%` }} 
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-500"
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {progress.completedMilestones.length} of {path.milestones?.length || 0} milestones completed
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-auto">
                      <Link 
                        to={`/learning-paths/${path._id || path.id}`}
                        className="flex-1 bg-white border border-purple-500 text-purple-700 px-4 py-2.5 rounded-lg text-center hover:bg-purple-50 transition-colors flex items-center justify-center"
                      >
                        View Details
                      </Link>
                      
                      {isAuthenticated && !progress && (
                        <button 
                          onClick={() => startProgress(path._id || path.id)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2.5 rounded-lg flex items-center justify-center transition-all shadow-sm hover:shadow"
                        >
                          Start Learning
                        </button>
                      )}
                      
                      {isAuthenticated && progress && (
                        <Link 
                          to={`/learning-progress/${progress._id}`}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2.5 rounded-lg transition-all shadow-sm hover:shadow flex items-center justify-center"
                        >
                          <span className="mr-1">Continue</span>
                          <FaArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 max-w-2xl mx-auto">
                <FaBrain className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No learning paths found</h3>
                <p className="text-gray-500 mb-8">
                  {searchTerm 
                    ? `No results found for "${searchTerm}"`
                    : activeTag
                    ? `No learning paths with the tag "#${activeTag}"`
                    : filter !== "all"
                    ? "No learning paths match your current filter"
                    : "Try adjusting your search criteria or explore our featured paths"
                  }
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setActiveTag("");
                    setFilter("all");
                  }}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors shadow-sm"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Call to Action Section */}
      {!isAuthenticated && (
        <div className="container mx-auto px-4 mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <img 
                src={badgeIcon} 
                alt="Badge" 
                className="absolute -right-10 -bottom-10 w-64 h-64 transform rotate-12" 
              />
              <img 
                src={leafIcon} 
                alt="Leaf" 
                className="absolute -left-10 -top-10 w-64 h-64 transform -rotate-45" 
              />
            </div>
            
            <div className="p-10 md:p-16 relative z-10 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to track your learning journey?
              </h2>
              <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
                Create a free account to track your progress, earn badges, and connect with other learners in the Skillshare community.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/register" 
                  className="px-8 py-3 bg-white text-purple-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Create Free Account
                </Link>
                <Link 
                  to="/login" 
                  className="px-8 py-3 bg-purple-700 text-white border border-purple-500 rounded-lg font-medium hover:bg-purple-800 transition-colors shadow-lg"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        
        .animate-fade-out {
          animation: fadeOut 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default LearningPathExplorer;