import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { login } from '../api';
import { AuthContext } from '../context/AuthContext';

/**
 * Login component for user authentication
 */
function Login({ history }) {
  const [userData, setUserData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { isAuthenticated, login: authLogin } = useContext(AuthContext);
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await login(userData);
      
      // Check if response has token
      if (response.token) {
        authLogin(response.token, response.username);
        history.push('/');
      } else {
        setError('Invalid login response');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="card-title text-center mb-4">Login</h3>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="d-grid">
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
            
            <div className="mt-3 text-center">
              <p>
                Don't have an account?{' '}
                <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;