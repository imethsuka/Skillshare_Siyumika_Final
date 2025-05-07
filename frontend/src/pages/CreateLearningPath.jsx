import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaPlus, FaTimes, FaArrowLeft, FaBook, FaCalendarAlt, FaTag, FaLink, FaLightbulb } from 'react-icons/fa';
import LearningPathService from '../services/LearningPathService';
import { useAuth } from '../utils/AuthContext';

function CreateLearningPath() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [duration, setDuration] = useState(30);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [tips, setTips] = useState('');
  const [milestones, setMilestones] = useState([{ 
    title: '', 
    description: '', 
    orderIndex: 0,
    estimatedDays: 1,
    resources: [],
    tips: ''
  }]);
  const [isPublic, setIsPublic] = useState(true);
  const [activeSection, setActiveSection] = useState('basic');

  // Handle adding a tag
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Handle adding a milestone
  const handleAddMilestone = () => {
    setMilestones([
      ...milestones, 
      {
        title: '',
        description: '',
        orderIndex: milestones.length,
        estimatedDays: 1,
        resources: [],
        tips: ''
      }
    ]);
  };

  // Handle removing a milestone
  const handleRemoveMilestone = (index) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  // Handle updating a milestone
  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index][field] = value;
    setMilestones(updatedMilestones);
  };

  // Handle adding a resource to a milestone
  const handleAddResource = (index, resource) => {
    if (resource.trim()) {
      const updatedMilestones = [...milestones];
      if (!updatedMilestones[index].resources) {
        updatedMilestones[index].resources = [];
      }
      updatedMilestones[index].resources.push(resource.trim());
      setMilestones(updatedMilestones);
      
      // Clear the input field
      document.getElementById(`resource-input-${index}`).value = '';
    }
  };

  // Handle removing a resource from a milestone
  const handleRemoveResource = (milestoneIndex, resourceIndex) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[milestoneIndex].resources.splice(resourceIndex, 1);
    setMilestones(updatedMilestones);
  };

  // Handle milestone reordering
  const handleMoveUp = (index) => {
    if (index > 0) {
      const updatedMilestones = [...milestones];
      [updatedMilestones[index], updatedMilestones[index-1]] = [updatedMilestones[index-1], updatedMilestones[index]];
      
      // Update order indices
      updatedMilestones.forEach((milestone, idx) => {
        milestone.orderIndex = idx;
      });
      
      setMilestones(updatedMilestones);
    }
  };

  const handleMoveDown = (index) => {
    if (index < milestones.length - 1) {
      const updatedMilestones = [...milestones];
      [updatedMilestones[index], updatedMilestones[index+1]] = [updatedMilestones[index+1], updatedMilestones[index]];
      
      // Update order indices
      updatedMilestones.forEach((milestone, idx) => {
        milestone.orderIndex = idx;
      });
      
      setMilestones(updatedMilestones);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }
    
    if (milestones.some(m => !m.title.trim() || !m.description.trim())) {
      setError('All milestones must have a title and description');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const learningPathData = {
        title,
        description,
        requirements,
        difficulty,
        duration: parseInt(duration),
        tags,
        milestones,
        isPublic,
        tips,
        userId: currentUser.id || currentUser._id,
      };
      
      const response = await LearningPathService.createPath(learningPathData);
      navigate(`/learning-paths/${response.data.id || response.data._id}`);
      
    } catch (err) {
      console.error('Failed to create learning path:', err);
      setError('Failed to create learning path. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get difficulty badge color
  const getDifficultyColor = (level) => {
    switch(level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-20 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back navigation */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/learning-paths')}
            className="text-purple-600 hover:text-purple-800 flex items-center transition-colors group"
          >
            <FaArrowLeft className="mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" /> 
            <span className="font-medium">Back to Learning Paths</span>
          </button>
        </div>
        
        {/* Main card with navigation tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
          {/* Decorative top border with gradient */}
          <div className="h-2 bg-gradient-to-r from-purple-500 via-purple-400 to-indigo-600"></div>
          
          {/* Header with icon */}
          <div className="px-6 py-6 flex flex-col md:flex-row justify-between items-center mb-2 border-b border-gray-100">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl shadow-md">
                <FaGraduationCap className="text-2xl text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 ml-4">Create Learning Path</h1>
            </div>
            
            {/* Navigation tabs */}
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setActiveSection('basic')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === 'basic' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
              >
                Basic Info
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('milestones')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === 'milestones' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
              >
                Milestones
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('preview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === 'preview' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
              >
                Preview
              </button>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mx-6 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Basic information section */}
            <div className={`px-6 pb-6 transition-opacity duration-300 ${activeSection === 'basic' ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="title" className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaBook className="mr-2 text-purple-500" /> Title <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                    placeholder="e.g. Learning React from Scratch"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-gray-700 font-medium mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Description <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    id="description"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all h-32"
                    placeholder="Provide a detailed description of the learning path"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="requirements" className="block text-gray-700 font-medium mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Prerequisites (optional)
                  </label>
                  <textarea
                    id="requirements"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all h-24"
                    placeholder="List any knowledge or tools needed before starting"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="difficulty" className="block text-gray-700 font-medium mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Difficulty Level
                    </label>
                    <div className="relative">
                      <select
                        id="difficulty"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 appearance-none transition-all"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(difficulty)} border`}>
                        {difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-gray-700 font-medium mb-2 flex items-center">
                      <FaCalendarAlt className="mr-2 text-purple-500" />
                      Estimated Duration (days)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      min="1"
                    />
                    
                    <div className="mt-2 text-sm text-gray-500">
                      Approximately {Math.round(duration/7)} weeks
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaTag className="mr-2 text-purple-500" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag, index) => (
                      <div 
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full flex items-center text-sm transition-all hover:bg-purple-200"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="ml-2 text-purple-600 hover:text-purple-800 focus:outline-none"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    {tags.length === 0 && (
                      <div className="text-sm text-gray-400 italic">No tags added yet</div>
                    )}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                      placeholder="Add a tag..."
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <button
                      type="button"
                      className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-r-lg hover:from-purple-700 hover:to-purple-800 transition-all"
                      onClick={handleAddTag}
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Tags help others find your learning path (e.g. javascript, webdev, design)
                  </div>
                </div>
                
                <div>
                  <label htmlFor="tips" className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaLightbulb className="mr-2 text-purple-500" />
                    Tips for Success (optional)
                  </label>
                  <textarea
                    id="tips"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all h-24"
                    placeholder="Share advice to help others succeed with this learning path"
                    value={tips}
                    onChange={(e) => setTips(e.target.value)}
                  ></textarea>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input 
                        type="checkbox" 
                        id="toggle-public" 
                        name="toggle-public"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                      />
                      <label 
                        htmlFor="toggle-public" 
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      ></label>
                    </div>
                    <span className="text-gray-700 font-medium">
                      Make this learning path public
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs ${isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {isPublic ? 'Public' : 'Private'}
                      </span>
                    </span>
                  </label>
                  <p className="text-sm text-gray-500 mt-1 ml-12">
                    {isPublic 
                      ? 'Anyone can discover and follow this learning path' 
                      : 'Only you can see this learning path'}
                  </p>
                </div>
                
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/learning-paths')}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('milestones')}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow hover:from-purple-700 hover:to-purple-800 transition-all hover:shadow-md flex items-center"
                  >
                    Next: Add Milestones
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Milestones section */}
            <div className={`px-6 pb-6 transition-opacity duration-300 ${activeSection === 'milestones' ? 'block' : 'hidden'}`}>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      Milestones
                      <span className="ml-2 text-sm text-gray-500 font-normal">({milestones.length})</span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 ml-8">Break down your learning path into steps</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg shadow hover:from-purple-700 hover:to-purple-800 transition-all hover:shadow-md flex items-center"
                  >
                    <FaPlus className="mr-2" /> Add Milestone
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md group"
                  >
                    <div className={`py-4 px-5 flex justify-between items-center bg-gradient-to-r ${
                      index === 0 ? 'from-purple-500/10 to-purple-600/5' : 
                      index % 2 === 0 ? 'from-blue-500/10 to-blue-600/5' : 
                      'from-indigo-500/10 to-indigo-600/5'
                    }`}>
                      <h3 className="font-medium text-gray-800 flex items-center">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center mr-2 text-sm font-bold ${
                          index === 0 ? 'bg-purple-100 text-purple-600' : 
                          index % 2 === 0 ? 'bg-blue-100 text-blue-600' : 
                          'bg-indigo-100 text-indigo-600'
                        }`}>
                          {index + 1}
                        </div>
                        {milestone.title ? (
                          <span>{milestone.title}</span>
                        ) : (
                          <span className="text-gray-400 italic">Untitled Milestone</span>
                        )}
                      </h3>
                      
                      <div className="flex items-center space-x-1">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveUp(index)}
                            className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                            title="Move up"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                        )}
                        
                        {index < milestones.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveDown(index)}
                            className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                            title="Move down"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                        
                        {milestones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMilestone(index)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Remove milestone"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-5 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor={`milestone-title-${index}`} className="block text-gray-700 text-sm font-medium mb-1">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id={`milestone-title-${index}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                            placeholder={`Milestone ${index + 1} title`}
                            value={milestone.title}
                            onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor={`milestone-days-${index}`} className="block text-gray-700 text-sm font-medium mb-1">
                            Estimated Days
                          </label>
                          <input
                            type="number"
                            id={`milestone-days-${index}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                            value={milestone.estimatedDays || 1}
                            onChange={(e) => handleMilestoneChange(index, 'estimatedDays', parseInt(e.target.value))}
                            min="1"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor={`milestone-description-${index}`} className="block text-gray-700 text-sm font-medium mb-1">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id={`milestone-description-${index}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all h-24"
                          placeholder="What should be learned in this milestone"
                          value={milestone.description}
                          onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                          required
                        ></textarea>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor={`milestone-tips-${index}`} className="block text-gray-700 text-sm font-medium mb-1 flex items-center">
                          <FaLightbulb className="mr-1 text-yellow-500" /> Tips (optional)
                        </label>
                        <textarea
                          id={`milestone-tips-${index}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all h-20"
                          placeholder="Helpful suggestions for completing this milestone"
                          value={milestone.tips || ''}
                          onChange={(e) => handleMilestoneChange(index, 'tips', e.target.value)}
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                          <FaLink className="mr-1 text-blue-500" /> Resources (optional)
                        </label>
                        <div className="mb-2 space-y-2">
                          {milestone.resources && milestone.resources.length > 0 ? (
                            milestone.resources.map((resource, resourceIndex) => (
                              <div key={resourceIndex} className="flex items-center">
                                <span className="flex-grow bg-gray-50 px-3 py-2 border border-gray-300 rounded-lg text-sm">{resource}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveResource(index, resourceIndex)}
                                  className="ml-2 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                  aria-label="Remove resource"
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-400 italic">No resources added yet</div>
                          )}
                        </div>
                        <div className="flex">
                          <input
                            type="text"
                            id={`resource-input-${index}`}
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                            placeholder="Add a book, article, video or URL..."
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResource(index, e.target.value))}
                          />
                          <button
                            type="button"
                            className="bg-blue-600 text-white px-3 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                            onClick={() => handleAddResource(index, document.getElementById(`resource-input-${index}`).value)}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setActiveSection('basic')}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('preview')}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow hover:from-purple-700 hover:to-purple-800 transition-all hover:shadow-md flex items-center"
                >
                  Preview
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Preview section */}
            <div className={`px-6 pb-6 transition-opacity duration-300 ${activeSection === 'preview' ? 'block' : 'hidden'}`}>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview Learning Path
                </h2>
                <p className="text-sm text-gray-500 mt-1 ml-8">Review your learning path before creating it</p>
              </div>
              
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <div className="bg-white p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title || "Untitled Learning Path"}</h1>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(difficulty)} border`}>
                          {difficulty}
                        </span>
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          {duration} days
                        </span>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${isPublic ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                          {isPublic ? 'Public' : 'Private'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {tags.length > 0 ? tags.map((tag, index) => (
                          <span key={index} className="inline-block px-2.5 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">
                            #{tag}
                          </span>
                        )) : (
                          <span className="text-sm text-gray-400 italic">No tags</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 h-16 w-16 rounded-xl flex items-center justify-center shadow-lg">
                      <FaGraduationCap className="text-3xl text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                  <p className="text-gray-600 mb-6 whitespace-pre-line">{description || "No description provided."}</p>
                  
                  {requirements && (
                    <>
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">Prerequisites</h2>
                      <p className="text-gray-600 mb-6 whitespace-pre-line">{requirements}</p>
                    </>
                  )}
                  
                  {tips && (
                    <>
                      <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                        <FaLightbulb className="mr-2 text-yellow-500" /> Tips for Success
                      </h2>
                      <p className="text-gray-600 mb-6 whitespace-pre-line">{tips}</p>
                    </>
                  )}
                  
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Learning Path Milestones
                  </h2>
                  
                  <div className="space-y-4">
                    {milestones.map((milestone, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <div className={`py-3 px-4 flex items-center border-b border-gray-200 ${
                          index === 0 ? 'bg-purple-50' : 
                          index % 2 === 0 ? 'bg-blue-50' : 
                          'bg-indigo-50'
                        }`}>
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold ${
                            index === 0 ? 'bg-purple-100 text-purple-600' : 
                            index % 2 === 0 ? 'bg-blue-100 text-blue-600' : 
                            'bg-indigo-100 text-indigo-600'
                          }`}>
                            {index + 1}
                          </div>
                          <h3 className="font-medium text-gray-800">
                            {milestone.title || "Untitled Milestone"}
                          </h3>
                          <div className="ml-auto flex items-center">
                            <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                              {milestone.estimatedDays} {milestone.estimatedDays === 1 ? 'day' : 'days'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <p className="text-gray-600 text-sm mb-3 whitespace-pre-line">
                            {milestone.description || "No description provided."}
                          </p>
                          
                          {milestone.tips && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-200 text-yellow-800 p-3 mb-3 text-sm rounded-r">
                              <div className="font-medium flex items-center mb-1">
                                <FaLightbulb className="mr-1.5 text-yellow-500" /> Tip
                              </div>
                              <p className="whitespace-pre-line">{milestone.tips}</p>
                            </div>
                          )}
                          
                          {milestone.resources && milestone.resources.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <FaLink className="mr-1.5 text-blue-500" /> Resources
                              </h4>
                              <ul className="text-sm space-y-1 text-gray-600">
                                {milestone.resources.map((resource, resourceIndex) => (
                                  <li key={resourceIndex} className="flex items-center">
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mr-2"></span>
                                    {resource}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setActiveSection('milestones')}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow hover:from-purple-700 hover:to-purple-800 transition-all hover:shadow-lg flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Learning Path
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Custom styles for the toggle switch */}
      <style jsx>{`
        .toggle-checkbox:checked {
          transform: translateX(100%);
          border-color: #8b5cf6;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #8b5cf6;
        }
      `}</style>
    </div>
  );
}

export default CreateLearningPath;