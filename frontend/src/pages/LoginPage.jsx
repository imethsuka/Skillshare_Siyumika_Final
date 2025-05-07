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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">Login</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-success w-100"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              
              <p className="text-center mt-3">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;