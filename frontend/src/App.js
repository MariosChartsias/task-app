import React from 'react';
    import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
    import TaskList from './components/TaskList';
    import TaskForm from './components/TaskForm';
    import Login from './components/Login';
    import Register from './components/Register';
    function App() {
      return (
        <Router>
          <div className="container mt-3">
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/" component={TaskList} />
            </Switch>
          </div>
        </Router>
      );
    }
    export default App;