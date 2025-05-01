import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import { AuthContext } from './context/AuthContext';

/**
 * Main application component
 * Handles routing and authentication state
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  // Check for existing authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      setIsAuthenticated(true);
      setUser({ username });
    }
  }, []);
  
  // Authentication context value
  const authContextValue = {
    isAuthenticated,
    user,
    login: (token, username) => {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      setIsAuthenticated(true);
      setUser({ username });
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setIsAuthenticated(false);
      setUser(null);
    }
  };
  
  // Protected route component
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="container mt-4">
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <PrivateRoute path="/" component={TaskList} />
            </Switch>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;