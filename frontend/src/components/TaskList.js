import React, { useEffect, useState, useContext } from 'react';
import { fetchTasks, deleteTask } from '../api';
import TaskForm from './TaskForm';
import { AuthContext } from '../context/AuthContext';

/**
 * Task list component - the main view of the application
 * Shows all tasks and allows CRUD operations
 */
function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTask, setCurrentTask] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { isAuthenticated } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  
  // Load tasks from API
  useEffect(() => {
    const loadTasks = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      try {
        const data = await fetchTasks(token);
        setTasks(data);
        setError('');
      } catch (err) {
        setError('Failed to load tasks. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadTasks();
  }, [isAuthenticated, token, refreshKey]);
  
  // Handler for task deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id, token);
        setRefreshKey(prev => prev + 1); // Trigger refresh
      } catch (err) {
        setError('Failed to delete task. Please try again.');
      }
    }
  };
  
  // Handler for setting a task to edit
  const handleEdit = (task) => {
    setCurrentTask(task);
  };
  
  // Handler for task updates
  const handleTaskUpdated = () => {
    setRefreshKey(prev => prev + 1); // Trigger refresh
    setCurrentTask(null); // Clear current task for editing
  };
  
  return (
    <div className="task-list-container">
      <div className="row mb-4">
        <div className="col">
          <h2>Your Tasks</h2>
          <p className="text-muted">Manage your tasks efficiently</p>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {/* Task Form - Either for creating or editing */}
      <TaskForm 
        onTaskAdded={handleTaskUpdated} 
        existingTask={currentTask}
        onCancel={() => setCurrentTask(null)}
      />
      
      {/* Task List */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="alert alert-info text-center">
          <p className="mb-0">You don't have any tasks yet. Create your first task above!</p>
        </div>
      ) : (
        <div className="list-group">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className="list-group-item list-group-item-action"
            >
              <div className="d-flex w-100 justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{task.title}</h5>
                  <p className="mb-1 text-muted">{task.description}</p>
                </div>
                <div className="btn-group">
                  <button 
                    onClick={() => handleEdit(task)} 
                    className="btn btn-sm btn-outline-primary"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)} 
                    className="btn btn-sm btn-outline-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;