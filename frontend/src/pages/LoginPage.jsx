// src/pages/LoginPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import UserService from '../services/userService';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!username.trim() || !password) {
      setError('Username and password are required');
      setLoading(false);
      return;
    }
    
    try {
      // Clear any previous console errors
      console.clear();
      
      // Make the login request
      const response = await UserService.login({
        username: username.trim(),
        password: password
      });
      
      // Check if the response contains user data and token
      if (response.data && response.data.user && response.data.token) {
        login(response.data);
        navigate('/');
      } else if (response.data && response.data.token) {
        // Handle case where user data is directly in the response
        login({ user: response.data, token: response.data.token });
        navigate('/');
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Provide more detailed error messages based on the type of error
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 500) {
          setError('Server error. Please check server logs or contact support.');
        } else if (err.response.status === 401 || err.response.status === 403) {
          setError('Invalid username or password. Please try again.');
        } else {
          setError(err.response.data?.message || 'Login failed. Please check your credentials.');
        }
      } else if (err.request) {
        // Request was made but no response
        setError('No response from server. Please check if the backend is running.');
      } else {
        // Other errors
        setError(err.message || 'An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card with subtle shadow and border */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Purple gradient header */}
          <div className="h-2 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500"></div>
          
          <div className="px-8 py-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
              <p className="text-gray-600 text-sm mt-2">Sign in to continue your learning journey</p>
            </div>

            {/* Error alert */}
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-4 4a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2.5 rounded-lg font-medium transition-colors shadow-md flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-purple-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-purple-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;