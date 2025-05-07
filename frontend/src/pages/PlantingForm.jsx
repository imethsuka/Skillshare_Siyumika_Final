import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import LearningPathService from '../services/LearningPathService';

const learningCategories = {
    'Programming': [
        'JavaScript',
        'Python',
        'Java',
        'C++',
        'React',
        'Node.js',
        'TypeScript',
        'SQL'
    ],
    'Languages': [
        'English',
        'Spanish',
        'French',
        'German',
        'Chinese',
        'Japanese'
    ],
    'Professional Skills': [
        'Project Management',
        'Data Analysis',
        'Digital Marketing',
        'UX Design',
        'Public Speaking'
    ],
    'Personal Development': [
        'Time Management',
        'Critical Thinking',
        'Creative Writing',
        'Leadership',
        'Problem Solving'
    ]
};

function PlantingForm() {
    const navigate = useNavigate();
    const { currentUser, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    
    const [learningData, setLearningData] = useState({
        skillType: '',
        dateStarted: '',
        expectedCompletion: '',
        steps: [{ description: '', resources: [] }]
    });

    useEffect(() => {
        // Redirect if not authenticated
        // if (!isAuthenticated) {
        //     navigate('/login?redirect=create-path');
        //     return;
        // }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLearningData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleStepChange = (index, e) => {
        const newSteps = learningData.steps.map((step, stepIndex) => {
            if (index === stepIndex) {
                return { ...step, description: e.target.value };
            }
            return step;
        });
        setLearningData(prevState => ({
            ...prevState,
            steps: newSteps
        }));
    };

    const handleResourceChange = (index, e) => {
        const newSteps = learningData.steps.map((step, stepIndex) => {
            if (index === stepIndex) {
                return { ...step, resources: [...step.resources, ...e.target.files] };
            }
            return step;
        });
        setLearningData(prevState => ({
            ...prevState,
            steps: newSteps
        }));
    };

    const addStep = () => {
        setLearningData(prevState => ({
            ...prevState,
            steps: [...prevState.steps, { description: '', resources: [] }]
        }));
    };

    const handleDeleteStep = (indexToDelete) => {
        setLearningData(prevState => ({
            ...prevState,
            steps: prevState.steps.filter((_, index) => index !== indexToDelete)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        
        try {
            // Format data for API
            const pathData = {
                title: `${learningData.skillType} Learning Path`,
                description: `Learning ${learningData.skillType} from ${learningData.dateStarted} with expected completion on ${learningData.expectedCompletion}`,
                userId: currentUser?._id || currentUser?.id,
                milestones: learningData.steps.map((step, index) => ({
                    title: `Milestone ${index + 1}`,
                    description: step.description,
                    orderIndex: index,
                    resources: [] // Resource uploads would require a separate file upload service
                })),
                isPublic: true,
                tags: [learningData.skillType.toLowerCase(), "learning", "education"]
            };
            
            // Send to backend
            const response = await LearningPathService.createPath(pathData);
            
            setSuccess(true);
            setLoading(false);
            
            // Navigate to the created path details page after a short delay
            setTimeout(() => {
                navigate(`/learning-paths/${response.data._id || response.data.id}`);
            }, 1500);
        } catch (err) {
            console.error("Error creating learning path:", err);
            setError("Failed to create learning path. Please try again.");
            setLoading(false);
        }
    };

    // If not authenticated, show a message instead of the form
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 py-12 px-4 flex items-center justify-center">
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-purple-600 py-6 px-8">
                        <h1 className="text-3xl font-bold text-center text-white">
                            🧠 Learning Journey Creator
                        </h1>
                    </div>
                    <div className="p-8 text-center">
                        <div className="text-8xl mb-4">🔒</div>
                        <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
                        <p className="mb-6">You need to be logged in to create a learning path.</p>
                        <div className="flex flex-col space-y-3">
                            <Link to="/login?redirect=create-path" 
                                  className="w-full px-6 py-3 text-white text-lg font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors">
                                Log In
                            </Link>
                            <Link to="/register" 
                                  className="w-full px-6 py-3 text-purple-700 text-lg font-semibold rounded-lg border border-purple-600 hover:bg-purple-50 transition-colors">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-purple-600 py-6 px-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full -mt-12 -mr-12 opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full -mb-12 -ml-12 opacity-20"></div>
                    
                    <h1 className="text-3xl font-bold text-center text-white relative z-10">
                        🧠 Learning Path Creator
                    </h1>
                    <p className="text-center text-purple-100 mt-2 relative z-10">
                        Map your path from beginner to mastery
                    </p>
                </div>
                
                <div className="p-8 relative">
                    <div className="absolute top-4 right-4 opacity-10 text-6xl">📚</div>
                    <div className="absolute bottom-4 left-4 opacity-10 text-6xl">🏆</div>
                    
                    {/* Success message */}
                    {success && (
                        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline"> Your learning path has been created. Redirecting you to the details page...</span>
                        </div>
                    )}
                    
                    {/* Error message */}
                    {error && (
                        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}
                    
                    {/* Form content */}
                    <form onSubmit={handleSubmit} className="space-y-6 relative" style={{ zIndex: 1 }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">What are you learning?</label>
                                <select
                                    name="skillType"
                                    value={learningData.skillType}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Select a skill to learn</option>
                                    {Object.entries(learningCategories).map(([category, skills]) => (
                                        <optgroup key={category} label={category}>
                                            {skills.map((skill) => (
                                                <option key={skill} value={skill}>
                                                    {skill}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    name="dateStarted"
                                    value={learningData.dateStarted}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-center mb-4">
                                <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold mr-3">
                                    <span>🎯</span>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-700">
                                    Learning Milestones
                                </h2>
                            </div>
                            
                            <p className="text-gray-600 mb-4">Break down your learning journey into achievable milestones.</p>
                            
                            {learningData.steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="bg-purple-50 p-6 rounded-lg mb-4 relative border border-purple-100"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-lg font-medium text-gray-700 flex items-center">
                                            <span className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm mr-2">
                                                {index + 1}
                                            </span>
                                            Milestone {index + 1}
                                        </label>
                                        {learningData.steps.length > 1 && (
                                            <button 
                                                type="button"
                                                onClick={() => handleDeleteStep(index)}
                                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                disabled={loading}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <textarea
                                        value={step.description}
                                        onChange={(e) => handleStepChange(index, e)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                        placeholder="Describe what you'll achieve in this milestone..."
                                        rows="3"
                                        required
                                        disabled={loading}
                                    />
                                    <div className="mt-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            📎 Add Resources for Milestone {index + 1}
                                        </label>
                                        <input
                                            type="file"
                                            onChange={(e) => handleResourceChange(index, e)}
                                            className="w-full"
                                            multiple
                                            disabled={loading}
                                        />
                                        <small className="text-gray-500 mt-1 block">
                                            Upload relevant learning materials or progress snapshots
                                        </small>
                                    </div>
                                </div>
                            ))}
                            
                            <button 
                                type="button" 
                                onClick={addStep}
                                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                                disabled={loading}
                            >
                                <span>➕ Add Another Milestone</span>
                            </button>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg mt-6 border-l-4 border-purple-400">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Target Completion Date</label>
                            <input
                                type="date"
                                name="expectedCompletion"
                                value={learningData.expectedCompletion}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button 
                            type="submit"
                            className={`w-full px-6 py-4 text-white text-lg font-semibold rounded-lg transition-colors mt-8 shadow-lg ${
                                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="mr-2">⏳</span>
                                    Creating Your Learning Path...
                                </>
                            ) : (
                                <>🚀 Create Learning Journey</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PlantingForm;
