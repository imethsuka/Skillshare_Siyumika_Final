import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import LearningProgressService from '../services/LearningProgressService';
import { FaChevronLeft, FaCheck, FaLock, FaUnlock, FaTrash, FaClock, FaCheckCircle, FaLink, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

function LearningPathProgressDetail() {
  const { progressId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [unsubscribing, setUnsubscribing] = useState(false);

  useEffect(() => {
    const fetchProgressDetails = async () => {
   /*     console.log(!isAuthenticated, !currentUser, isAuthenticated, currentUser, progressId)
      if (progressId && !isAuthenticated || !currentUser) {
        navigate('/login?redirect=learning-progress');
        return;
      }*/

      try {
        setLoading(true);
        console.log("Fetching progress details for ID:", progressId);
        const response = await LearningProgressService.getProgressDetail(progressId);
        console.log("Progress details received:", response.data);
        setProgress(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch progress details:", err);
        setError(`Failed to load progress details. Error: ${err.message || 'Unknown error'}`);
        setLoading(false);
      }
    };

    fetchProgressDetails();
  }, [progressId, isAuthenticated, currentUser, navigate]);

  // Mark a milestone as completed
  const completeMilestone = async (milestoneId) => {
    try {
      await LearningProgressService.completeMilestone(progressId, milestoneId);
      await LearningProgressService.updateProgressPercentage(progressId);
      
      // Update the UI
      const updatedProgress = await LearningProgressService.getProgressDetail(progressId);
      setProgress(updatedProgress.data);
      
      // If this completed the learning path, show a celebration
      if (updatedProgress.data.progressPercentage === 100) {
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
            <div>You've completed the "${updatedProgress.data.learningPath?.title}" learning path!</div>
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

  // Unmark a milestone as completed
  const uncompleteMilestone = async (milestoneId) => {
    try {
      // Check if this is the last milestone in sequence - only allow uncompleting the most recent milestone
      if (!progress || !progress.completedMilestones) return;
      
      const sortedMilestones = [...progress.learningPath?.milestones].sort((a, b) => a.orderIndex - b.orderIndex);
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
      
      await LearningProgressService.uncompleteMilestone(progressId, milestoneId);
      await LearningProgressService.updateProgressPercentage(progressId);
      
      // Update the UI
      const updatedProgress = await LearningProgressService.getProgressDetail(progressId);
      setProgress(updatedProgress.data);
      
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
  const isMilestoneCompleted = (milestoneId) => {
    if (!progress || !progress.completedMilestones) return false;
    return progress.completedMilestones.some(
      completed => completed.milestoneId === milestoneId
    );
  };

  // Unsubscribe from this learning path
  const unsubscribeFromPath = async () => {
    try {
      setUnsubscribing(true);
      await LearningProgressService.deleteProgress(progressId);
      
      // Show success message
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up';
      toast.textContent = 'You have successfully unsubscribed from this learning path';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('animate-fade-out');
        setTimeout(() => {
          document.body.removeChild(toast);
          // Navigate back to the learning progress page
          navigate('/learning-progress');
        }, 500);
      }, 2000);
    } catch (err) {
      console.error("Failed to unsubscribe from learning path:", err);
      alert("Failed to unsubscribe from this learning path. Please try again.");
      setUnsubscribing(false);
      setShowUnsubscribeModal(false);
    }
  };

  // Render milestone node tree
  const renderMilestones = () => {
    if (!progress || !progress.learningPath || !progress.learningPath?.milestones || progress.learningPath?.milestones.length === 0) {
      return <div className="text-gray-500 italic">No milestones found for this learning path.</div>;
    }

    // Sort milestones by their order index
    const sortedMilestones = [...progress.learningPath?.milestones].sort((a, b) => a.orderIndex - b.orderIndex);

    return (
      <div className="space-y-6 mt-4">
        {sortedMilestones.map((milestone, index) => {
          const milestoneId = milestone.id || milestone._id;
          const isCompleted = isMilestoneCompleted(milestoneId);
          
          // Check if this is the most recently completed milestone
          const isLastCompleted = isCompleted && (
            index === sortedMilestones.length - 1 || 
            !isMilestoneCompleted(sortedMilestones[index + 1].id || sortedMilestones[index + 1]._id)
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
                      : index === 0 || (index > 0 && isMilestoneCompleted(sortedMilestones[index-1].id || sortedMilestones[index-1]._id))
                        ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                  onClick={() => {
                    if (isCompleted && isLastCompleted) {
                      // If completed and it's the last completed one, allow unmarking
                      uncompleteMilestone(milestoneId);
                    } else if (!isCompleted && (index === 0 || isMilestoneCompleted(sortedMilestones[index-1].id || sortedMilestones[index-1]._id))) {
                      // If not completed and it's the next milestone, allow completing
                      completeMilestone(milestoneId);
                    }
                  }}
                  title={
                    isCompleted && isLastCompleted
                      ? "Click to unmark this milestone"
                      : !isCompleted && (index === 0 || isMilestoneCompleted(sortedMilestones[index-1].id || sortedMilestones[index-1]._id))
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
                    {!isCompleted && (index === 0 || isMilestoneCompleted(sortedMilestones[index-1].id || sortedMilestones[index-1]._id)) && (
                      <button
                        onClick={() => completeMilestone(milestoneId)}
                        className="flex items-center py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                      >
                        <FaCheckCircle className="mr-2" />
                        Mark as Completed
                      </button>
                    )}
                    
                    {/* Unmark button - only show for the last completed milestone */}
                    {isCompleted && isLastCompleted && (
                      <button
                        onClick={() => uncompleteMilestone(milestoneId)}
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

  // No progress loaded
  if (!progress) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p>Unable to load this learning path. It may have been deleted or you don't have permission to view it.</p>
          <Link 
            to="/learning-progress"
            className="text-yellow-700 font-medium hover:underline mt-2 inline-block"
          >
            Return to Learning Progress
          </Link>
        </div>
      </div>
    );
  }

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
      
      {/* Back navigation */}
      <div className="mb-6">
        <Link 
          to="/learning-progress" 
          className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
        >
          <FaChevronLeft className="mr-2" />
          Back to Learning Progress
        </Link>
      </div>
      
      {/* Learning Path Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-gray-800">{progress.learningPath?.title}</h1>
          <p className="text-gray-600 mt-2">{progress.learningPath?.description}</p>
          
          <div className="flex items-center mt-3 text-sm text-gray-500">
            <FaClock className="mr-2" /> 
            Started on {new Date(progress.startedAt).toLocaleDateString()}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {progress.learningPath?.tags && progress.learningPath?.tags.map((tag, i) => (
              <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Progress Status Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 min-w-[250px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Your Progress</h3>
            <div>
              {progress.progressPercentage >= 100 ? (
                <span className="status-badge completed-badge text-xs px-2 py-0.5 rounded-full bg-fuchsia-600 text-white">
                  Completed
                </span>
              ) : (
                <span className="status-badge text-xs px-2 py-0.5 rounded-full bg-violet-600 text-white">
                  In Progress
                </span>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">
                {progress.progressPercentage || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-full rounded-full ${progress.progressPercentage >= 100 ? 'bg-fuchsia-600' : 'bg-purple-600'}`}
                style={{ width: `${progress.progressPercentage || 0}%` }}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              {progress.completedMilestones?.length || 0} of {progress.learningPath?.milestones?.length || 0} milestones completed
            </span>
          </div>
          
          <button
            onClick={() => setShowUnsubscribeModal(true)}
            className="mt-6 flex items-center justify-center w-full py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors border border-red-200"
          >
            <FaTrash className="mr-2" />
            Unsubscribe
          </button>
        </div>
      </div>
      
      {/* Learning Path Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main content with milestone tree */}
        <div className="md:col-span-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Milestones</h2>
            {renderMilestones()}
          </div>
        </div>
        
        {/* Sidebar with additional information */}
        <div className="md:col-span-4">
          {/* Course Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">About this Learning Path</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Duration</p>
                  <p className="text-gray-800">{progress.learningPath?.duration || 30} days estimated</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Participants</p>
                  <p className="text-gray-800">{progress.learningPath?.usersFollowing?.length || 0} learners enrolled</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Milestones</p>
                  <p className="text-gray-800">{progress.learningPath?.milestones?.length || 0} total milestones</p>
                </div>
              </div>
              
              {progress.learningPath?.createdBy && (
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Created By</p>
                    <p className="text-gray-800">{progress.learningPath?.createdBy.username || progress.learningPath?.createdBy.name || "Unknown"}</p>
                  </div>
                </div>
              )}
            </div>
            
            <Link 
              to={`/learning-paths/${progress.learningPath?._id || progress.learningPath?.id}`}
              className="mt-4 w-full flex items-center justify-center py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
            >
              View Learning Path Details
            </Link>
          </div>
          
          {/* Progress Visualization */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Progress Visualization</h3>
            
            <div className="mt-4">
              <div className="flex flex-col items-center">
                {progress.progressPercentage >= 100 ? (
                  <div className="text-amber-500 flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                ) : progress.progressPercentage >= 50 ? (
                  <div className="text-green-500 flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ) : (
                  <div className="text-purple-500 flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                )}
                
                <div className="text-center">
                  {progress.progressPercentage >= 100 ? (
                    <p className="text-fuchsia-600 font-semibold">Congratulations on completing this learning path!</p>
                  ) : progress.progressPercentage >= 50 ? (
                    <p className="text-green-600 font-semibold">You're making great progress!</p>
                  ) : (
                    <p className="text-purple-600 font-semibold">You're just getting started!</p>
                  )}
                  <p className="text-gray-500 mt-2 text-sm">Keep going! Every step takes you closer to mastery.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Unsubscribe Confirmation Modal */}
      {showUnsubscribeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">Unsubscribe from Learning Path</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to unsubscribe from <span className="font-semibold text-purple-700">{progress.learningPath?.title}</span>? 
              This will delete all your progress, and you'll need to start over if you enroll again.
            </p>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUnsubscribeModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                disabled={unsubscribing}
              >
                Cancel
              </button>
              <button
                onClick={unsubscribeFromPath}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                disabled={unsubscribing}
              >
                {unsubscribing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Unsubscribing...
                  </>
                ) : (
                  <>
                    <FaTrash className="mr-2" />
                    Unsubscribe
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default LearningPathProgressDetail;