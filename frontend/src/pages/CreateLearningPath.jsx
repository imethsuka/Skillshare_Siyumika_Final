import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaPlus, FaTimes, FaArrowLeft } from 'react-icons/fa';
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/learning-paths')}
          className="text-purple-600 hover:underline flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Learning Paths
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-purple-100 p-3 rounded-full">
            <FaGraduationCap className="text-3xl text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 ml-4">Create Learning Path</h1>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description *
            </label>
            <textarea
              id="description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label htmlFor="requirements" className="block text-gray-700 font-medium mb-2">
              Prerequisites (optional)
            </label>
            <textarea
              id="requirements"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 h-24"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="difficulty" className="block text-gray-700 font-medium mb-2">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">
                Estimated Duration (days)
              </label>
              <input
                type="number"
                id="duration"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <div 
                  key={index}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                placeholder="Add a tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button
                type="button"
                className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition-colors"
                onClick={handleAddTag}
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="tips" className="block text-gray-700 font-medium mb-2">
              Tips for Success (optional)
            </label>
            <textarea
              id="tips"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 h-24"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
            ></textarea>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Milestones *</h2>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" /> Add Milestone
              </button>
            </div>
            
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-800">Milestone {index + 1}</h3>
                    {milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor={`milestone-title-${index}`} className="block text-gray-700 text-sm font-medium mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      id={`milestone-title-${index}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                      value={milestone.title}
                      onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor={`milestone-description-${index}`} className="block text-gray-700 text-sm font-medium mb-1">
                      Description *
                    </label>
                    <textarea
                      id={`milestone-description-${index}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 h-24"
                      value={milestone.description}
                      onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor={`milestone-tips-${index}`} className="block text-gray-700 text-sm font-medium mb-1">
                      Tips (optional)
                    </label>
                    <textarea
                      id={`milestone-tips-${index}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 h-20"
                      value={milestone.tips || ''}
                      onChange={(e) => handleMilestoneChange(index, 'tips', e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor={`milestone-days-${index}`} className="block text-gray-700 text-sm font-medium mb-1">
                      Estimated Days
                    </label>
                    <input
                      type="number"
                      id={`milestone-days-${index}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                      value={milestone.estimatedDays || 1}
                      onChange={(e) => handleMilestoneChange(index, 'estimatedDays', parseInt(e.target.value))}
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Resources (optional)
                    </label>
                    <div className="mb-2">
                      {milestone.resources && milestone.resources.map((resource, resourceIndex) => (
                        <div key={resourceIndex} className="flex items-center mb-2">
                          <span className="flex-grow bg-white px-3 py-2 border border-gray-300 rounded-lg">{resource}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveResource(index, resourceIndex)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        id={`resource-input-${index}`}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                        placeholder="Add a resource link or description..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResource(index, e.target.value))}
                      />
                      <button
                        type="button"
                        className="bg-purple-600 text-white px-3 py-2 rounded-r-lg hover:bg-purple-700 transition-colors"
                        onClick={() => handleAddResource(index, document.getElementById(`resource-input-${index}`).value)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-purple-600"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">Make this learning path public</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/learning-paths')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
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
                'Create Learning Path'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateLearningPath;