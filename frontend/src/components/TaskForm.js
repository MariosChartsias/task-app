import React, { useState } from 'react';
import { createTask, updateTask } from '../api';

/**
 * Task form component for creating and editing tasks
 */
function TaskForm({ onTaskAdded, existingTask, onCancel }) {
  const initialState = existingTask || { title: '', description: '' };
  const [task, setTask] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const token = localStorage.getItem('token');
  const isEditing = !!existingTask;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isEditing) {
        // Update existing task
        await updateTask(existingTask.id, task, token);
      } else {
        // Create new task
        await createTask(task, token);
        // Clear form after creation
        setTask({ title: '', description: '' });
      }
      
      if (onTaskAdded) {
        onTaskAdded();
      }
    } catch (err) {
      setError(err.message || 'Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title">{isEditing ? 'Edit Task' : 'Create New Task'}</h5>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={task.title}
              onChange={handleChange}
              required
              placeholder="Enter task title"
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={task.description}
              onChange={handleChange}
              rows="3"
              placeholder="Enter task description"
            ></textarea>
          </div>
          
          <div className="d-flex justify-content-end">
            {isEditing && (
              <button
                type="button"
                className="btn btn-outline-secondary me-2"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;