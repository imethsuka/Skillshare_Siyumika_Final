import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import LearningProgressService from '../services/LearningProgressService';
import { FaChevronRight, FaChevronDown, FaCheck, FaClock, FaTrophy, FaLeaf, FaCheckCircle, FaLink, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

function LearningProgressPage() {
  const navigate = useNavigate();
  const { progressId } = useParams(); // Get progress ID from URL if available
  const { currentUser, isAuthenticated } = useAuth();
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProgress, setSelectedProgress] = useState(null);

  // Fetch all learning progress for the current user
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!isAuthenticated || !currentUser) {
        navigate('/login?redirect=learning-progress');
        return;
      }

      try {
        setLoading(true);
        const userId = currentUser._id || currentUser.id;
        const response = await LearningProgressService.getUserProgress(userId);

        // Get full details for each learning progress
        const progressDetails = await Promise.all(
          response.data.map(async (progress) => {
            const detailResponse = await LearningProgressService.getProgressDetail(progress._id || progress.id);
            return detailResponse.data;
          })
        );

        setUserProgress(progressDetails);
        setLoading(false);

        // If progressId is provided in URL, select that progress
        if (progressId) {
          const selectedProgress = progressDetails.find(p => 
            (p._id || p.id) === progressId
          );
          
          if (selectedProgress) {
            setSelectedProgress(selectedProgress);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user progress:", err);
        setError("Failed to load your learning progress. Please try again.");
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [isAuthenticated, currentUser, navigate, progressId]);

  // Mark a milestone as completed
  const completeMilestone = async (progressId, milestoneId) => {
    try {
      await LearningProgressService.completeMilestone(progressId, milestoneId);
      await LearningProgressService.updateProgressPercentage(progressId);
      
      // Update the UI by refetching the progress details
      const updatedProgress = await LearningProgressService.getProgressDetail(progressId);
      
      // Check if this was the last milestone to complete the learning path
      const path = updatedProgress.data.learningPath;
      const isCompleted = updatedProgress.data.progressPercentage === 100;
      
      // Update the UI
      setUserProgress(prev => 
        prev.map(progress => 
          (progress._id || progress.id) === progressId ? updatedProgress.data : progress
        )
      );
      
      // Also update selectedProgress if it's the one being modified
      if (selectedProgress && (selectedProgress._id || selectedProgress.id) === progressId) {
        setSelectedProgress(updatedProgress.data);
      }
      
      // If this completed the learning path, show a celebration
      if (isCompleted) {
        // Show a celebratory toast message
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up flex items-center';
        toast.innerHTML = `
          <div class="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="font-bold">Congratulations! 🎉</div>
            <div>You've completed the "${path.title}" learning path!</div>
          </div>
        `;
        document.body.appendChild(toast);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
          toast.classList.add('animate-fade-out');
          setTimeout(() => document.body.removeChild(toast), 500);
        }, 5000);
      }
    } catch (err) {
      console.error("Failed to complete milestone:", err);
      alert("Failed to mark milestone as completed. Please try again.");
    }
  };

  // Add a function to uncomplete a milestone
  const uncompleteMilestone = async (progressId, milestoneId) => {
    try {
      // First find the completed milestone to delete
      const progress = userProgress.find(p => (p._id || p.id) === progressId);
      if (!progress || !progress.completedMilestones) return;
      
      // Check if this is the last milestone in sequence - only allow uncompleting the most recent milestone
      const sortedMilestones = [...progress.learningPath.milestones].sort((a, b) => a.orderIndex - b.orderIndex);
      const completedMilestoneIds = progress.completedMilestones.map(cm => cm.milestoneId);
      
      // Get the highest ordered completed milestone
      let highestOrderedCompletedIndex = -1;
      sortedMilestones.forEach((milestone, index) => {
        if (completedMilestoneIds.includes(milestone.id || milestone._id)) {
          highestOrderedCompletedIndex = index;
        }
      });
      
      // Only allow uncompleting the last milestone in the sequence
      const milestoneToUncomplete = sortedMilestones[highestOrderedCompletedIndex];
      if ((milestoneToUncomplete.id || milestoneToUncomplete._id) !== milestoneId) {
        alert("You can only unmark the most recently completed milestone.");
        return;
      }
      
      // Call API to remove the milestone from completed ones
      await LearningProgressService.uncompleteMilestone(progressId, milestoneId);
      await LearningProgressService.updateProgressPercentage(progressId);
      
      // Update the UI
      const updatedProgress = await LearningProgressService.getProgressDetail(progressId);
      setUserProgress(prev => 
        prev.map(p => (p._id || p.id) === progressId ? updatedProgress.data : p)
      );
      
      // Also update selectedProgress if it's the one being modified
      if (selectedProgress && (selectedProgress._id || selectedProgress.id) === progressId) {
        setSelectedProgress(updatedProgress.data);
      }
      
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up';
      toast.textContent = 'Milestone marked as not completed';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('animate-fade-out');
        setTimeout(() => document.body.removeChild(toast), 500);
      }, 3000);
      
    } catch (err) {
      console.error("Failed to unmark milestone:", err);
      alert("Failed to unmark milestone as completed. Please try again.");
    }
  };

  // Check if a milestone is completed
  const isMilestoneCompleted = (progress, milestoneId) => {
    if (!progress.completedMilestones) return false;
    return progress.completedMilestones.some(
      completed => completed.milestoneId === milestoneId
    );
  };

  // Render milestone node tree
  const renderMilestones = (progress) => {
    if (!progress.learningPath || !progress.learningPath.milestones || progress.learningPath.milestones.length === 0) {
      return <div className="text-gray-500 italic">No milestones found for this learning path.</div>;
    }

    // Sort milestones by their order index
    const sortedMilestones = [...progress.learningPath.milestones].sort((a, b) => a.orderIndex - b.orderIndex);

    return (
      <div className="space-y-6 mt-4">
        {sortedMilestones.map((milestone, index) => {
          const isCompleted = isMilestoneCompleted(progress, milestone.id || milestone._id);
          const milestoneId = milestone.id || milestone._id;
          
          // Check if this is the most recently completed milestone
          const isLastCompleted = isCompleted && (
            index === sortedMilestones.length - 1 || 
            !isMilestoneCompleted(progress, sortedMilestones[index + 1].id || sortedMilestones[index + 1]._id)
          );
          
          return (
            <div 
              key={milestoneId || index} 
              className={`relative ${index < sortedMilestones.length - 1 ? 'pb-6' : ''}`}
            >
              {/* Vertical connection line */}
              {index < sortedMilestones.length - 1 && (
                <div 
                  className={`absolute left-6 top-12 w-0.5 h-full -ml-0.5 ${
                    isCompleted ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />
              )}
              
              <div className={`flex items-start p-4 rounded-lg hover:shadow-md transition-shadow ${
                isCompleted 
                  ? 'bg-green-50 border-l-4 border-green-400' 
                  : 'bg-gray-50 border-l-4 border-gray-200'
              }`}>
                {/* Node circle - make it interactive */}
                <div 
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4 cursor-pointer transform hover:scale-110 transition-all ${
                    isCompleted 
                      ? 'bg-green-400 text-white hover:bg-green-500' 
                      : index === 0 || (index > 0 && isMilestoneCompleted(progress, sortedMilestones[index-1].id || sortedMilestones[index-1]._id))
                        ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                  onClick={() => {
                    if (isCompleted && isLastCompleted) {
                      // If completed and it's the last completed one, allow unmarking
                      uncompleteMilestone(progress._id || progress.id, milestoneId);
                    } else if (!isCompleted && (index === 0 || isMilestoneCompleted(progress, sortedMilestones[index-1].id || sortedMilestones[index-1]._id))) {
                      // If not completed and it's the next milestone, allow completing
                      completeMilestone(progress._id || progress.id, milestoneId);
                    }
                  }}
                  title={
                    isCompleted && isLastCompleted
                      ? "Click to unmark this milestone"
                      : !isCompleted && (index === 0 || isMilestoneCompleted(progress, sortedMilestones[index-1].id || sortedMilestones[index-1]._id))
                        ? "Click to mark as completed"
                        : isCompleted
                          ? "Completed milestone"
                          : "Lock milestone - complete previous milestones first"
                  }
                >
                  {isCompleted ? (
                    <FaCheck className="text-xl" />
                  ) : (
                    <span className="text-lg font-semibold">{index + 1}</span>
                  )}
                </div>
                
                <div className="flex-grow">
                  <h3 className={`text-lg font-semibold ${isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{milestone.description}</p>
                  
                  {/* Resources section */}
                  {milestone.resources && milestone.resources.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Resources:</h4>
                      <ul className="list-disc list-inside text-sm text-purple-600">
                        {milestone.resources.map((resource, i) => (
                          <li key={i} className="flex items-start">
                            <FaLink className="mr-1 mt-1 text-purple-400" />
                            <span>{resource}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Milestone action buttons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {/* Mark as completed button */}
                    {!isCompleted && (index === 0 || isMilestoneCompleted(progress, sortedMilestones[index-1].id || sortedMilestones[index-1]._id)) && (
                      <button
                        onClick={() => completeMilestone(progress._id || progress.id, milestoneId)}
                        className="flex items-center py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                      >
                        <FaCheckCircle className="mr-2" />
                        Mark as Completed
                      </button>
                    )}
                    
                    {/* Unmark button - only show for the last completed milestone */}
                    {isCompleted && isLastCompleted && (
                      <button
                        onClick={() => uncompleteMilestone(progress._id || progress.id, milestoneId)}
                        className="flex items-center py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Unmark Milestone
                      </button>
                    )}
                  </div>
                  
                  {/* Completion status and date */}
                  {isCompleted && (
                    <div className="mt-2 text-sm text-green-600">
                      <span className="flex items-center">
                        <FaCheckCircle className="mr-1" />
                        Completed on {new Date(
                          progress.completedMilestones.find(
                            m => m.milestoneId === milestoneId
                          ).completedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
          <button 
            className="text-red-700 font-medium hover:underline mt-2"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // No progress yet
  if (userProgress.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Learning Progress</h1>
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[300px]">
          <img 
            src="/src/images/progress/plant.png" 
            alt="Empty progress"
            className="w-32 h-32 mb-6 opacity-50"
          />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No learning paths started yet</h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Start tracking your learning journey by joining a learning path. Once you start, your progress will appear here.
          </p>
          <Link 
            to="/learning-paths" 
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Explore Learning Paths
          </Link>
        </div>
      </div>
    );
  }

  // Create a visual representation of all learning paths progress
  const renderProgressOverview = () => {
    console.log({userProgress})
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userProgress.map(progress => {
          const path = progress.learningPath;
          //if (!path) return null;
          
          // Calculate total milestones and completed ones
          const totalMilestones = path?.milestones?.length || 0;
          const completedCount = progress.completedMilestones?.length || 0;
          
          // Generate node indicators for each milestone
          const milestoneNodes = [];
          for (let i = 0; i < totalMilestones && i < 5; i++) { // Only show up to 5 nodes to avoid clutter
            const isCompleted = i < completedCount;
            const isActive = i === completedCount && i < totalMilestones;
            
            milestoneNodes.push(
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-5 h-5 rounded-full ${
                    isCompleted ? 'bg-green-500' : isActive ? 'bg-purple-500' : 'bg-gray-300'
                  } transition-all duration-300`}
                />
                {i < Math.min(totalMilestones, 5) - 1 && (
                  <div className={`h-4 w-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                )}
              </div>
            );
          }
          
          // Add indicator if we're showing truncated milestones
          if (totalMilestones > 5) {
            milestoneNodes.push(
              <div key="more" className="flex items-center ml-1">
                <span className="text-xs text-gray-500">+{totalMilestones - 5} more</span>
              </div>
            );
          }
          
          return (
            <motion.div
              key={progress._id || progress.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/learning-progress/${progress._id || progress.id}`)}
            >
              <div className={`p-4 ${progress.progressPercentage >= 100 ? 'bg-gradient-to-r from-fuchsia-500 to-fuchsia-700' : 'bg-gradient-to-r from-violet-500 to-violet-700'} text-white`}>
                <h3 className="font-semibold text-xl">{path?.title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-white/90">
                    Started {new Date(progress.startedAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="inline-flex items-center bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                      {progress.progressPercentage >= 100 ? 'Completed' : `${progress.progressPercentage}% Complete`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-3">
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                    <div 
                      className={`h-full rounded-full ${progress.progressPercentage >= 100 ? 'bg-fuchsia-600' : 'bg-violet-600'}`}
                      style={{ width: `${progress.progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{completedCount} completed</span>
                    <span>{totalMilestones} total milestones</span>
                  </div>
                </div>
                
                {path?.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{path?.description}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {(path?.tags || []).slice(0, 3).map((tag, i) => (
                    <span key={i} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                  {(path?.tags || []).length > 3 && (
                    <span className="text-xs text-gray-500">+{(path?.tags?.length || 3) - 3} more</span>
                  )}
                </div>
                
                <div className="mt-3">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">PROGRESS PATH</h4>
                  <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                    {milestoneNodes}
                  </div>
                </div>
                
                <button 
                  className="mt-4 w-full py-2 bg-purple-100 text-purple-700 rounded-md font-medium hover:bg-purple-200 transition-colors flex items-center justify-center"
                >
                  View Details <FaChevronRight className="ml-1" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  // If a specific progress is selected (detail view)
  if (selectedProgress) {
    return (
      <div className="container mx-auto px-4 py-16">
        {/* CSS Animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
          
          .animate-fade-in-up {
            animation: fadeInUp 0.3s ease-out forwards;
          }
          
          .animate-fade-out {
            animation: fadeOut 0.5s ease-out forwards;
          }
          
          .status-badge {
            transition: all 0.3s ease;
          }
          
          .completed-badge {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(192, 38, 211, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(192, 38, 211, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(192, 38, 211, 0);
            }
          }
        `}</style>
        
        <div className="mb-8">
          <button 
            onClick={() => {
              navigate('/learning-progress');
              setSelectedProgress(null);
            }}
            className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to All Learning Paths
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{selectedProgress.learningPath.title}</h1>
              <p className="text-gray-600 mt-1">{selectedProgress.learningPath.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {(selectedProgress.learningPath.tags || []).map((tag, i) => (
                  <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <Link 
              to={`/learning-paths/${selectedProgress.learningPath._id || selectedProgress.learningPath.id}`}
              className="text-purple-600 hover:text-purple-800 flex items-center"
            >
              View Original Path <FaChevronRight className="ml-1" />
            </Link>
          </div>
          
          <div className="mb-8 flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex-grow">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-700">
                  {selectedProgress.progressPercentage || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${selectedProgress.progressPercentage || 0}%` }}
                />
              </div>
            </div>
            <div className="ml-6 text-center">
              <span className="text-sm text-gray-600 block">Completed</span>
              <span className="text-3xl font-bold text-purple-700">
                {selectedProgress.completedMilestones?.length || 0}/{selectedProgress.learningPath.milestones?.length || 0}
              </span>
            </div>
            <div className="ml-6 text-center">
              <span className="text-sm text-gray-600 block">Started On</span>
              <span className="text-base font-medium text-gray-700">
                {new Date(selectedProgress.startedAt).toLocaleDateString()}
              </span>
            </div>
            {selectedProgress.completedMilestones?.length > 0 && (
              <div className="ml-6 text-center">
                <span className="text-sm text-gray-600 block">Last Activity</span>
                <span className="text-base font-medium text-gray-700">
                  {new Date(
                    Math.max(...selectedProgress.completedMilestones.map(
                      m => new Date(m.completedAt).getTime()
                    ))
                  ).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Milestones</h2>
            {renderMilestones(selectedProgress)}
          </div>
        </div>
      </div>
    );
  }

  // Show overview of all learning paths (main view)
  return (
    <div className="container mx-auto px-4 py-16">
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-4">My Learning Progress</h1>
      <p className="text-gray-600 mb-8">Track your progress across different learning paths. Click on any path to view detailed milestones.</p>
      
      {/* Growth visualization - show at the top as a motivational banner */}
      {userProgress.length > 0 && (
        <div className="mb-10 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="mr-6">
              {userProgress.some(p => p.progressPercentage >= 100) ? (
                <img 
                  src="/src/images/progress/trophy.png" 
                  alt="Trophy" 
                  className="w-16 h-16"
                />
              ) : userProgress.some(p => p.progressPercentage >= 50) ? (
                <img 
                  src="/src/images/progress/plant.png" 
                  alt="Growing plant" 
                  className="w-16 h-16"
                />
              ) : (
                <img 
                  src="/src/images/progress/leaf.png" 
                  alt="Leaf" 
                  className="w-16 h-16"
                />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">
                {userProgress.some(p => p.progressPercentage >= 100)
                  ? "You're smashing it! 🎉"
                  : userProgress.some(p => p.progressPercentage >= 50)
                    ? "Making great progress! 🌱"
                    : "You're on your way! 🍃"
                }
              </h3>
              <p className="text-gray-600">
                {userProgress.some(p => p.progressPercentage >= 100)
                  ? `You've completed ${userProgress.filter(p => p.progressPercentage >= 100).length} learning path${userProgress.filter(p => p.progressPercentage >= 100).length !== 1 ? 's' : ''}. Keep up the great work!`
                  : userProgress.some(p => p.progressPercentage >= 50)
                    ? "You're making steady progress on your learning journey. You're over halfway there!"
                    : "You've taken the first steps on your learning journey. Keep going!"
                }
              </p>
            </div>
            <div className="ml-auto">
              <Link 
                to="/learning-paths" 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center"
              >
                Explore More Paths
                <FaChevronRight className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content - learning path cards */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Learning Paths</h2>
      {renderProgressOverview()}
    </div>
  );
}

export default LearningProgressPage;