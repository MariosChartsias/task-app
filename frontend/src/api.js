/**
 * API service for communicating with the backend
 */
const API_URL = 'http://localhost:8080/api';

/**
 * Handle API responses and convert to JSON or text based on content type
 * @param {Response} response - Fetch API response object
 * @returns {Promise<Object|string>} - Parsed response data
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    const error = contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();
    throw new Error(typeof error === 'string' ? error : JSON.stringify(error));
  }
  
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
};

/**
 * Login user and get authentication token
 * @param {Object} credentials - User credentials {username, password}
 * @returns {Promise<Object>} - Response with token and username
 */
export async function login(credentials) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(credentials)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Register a new user
 * @param {Object} credentials - User data {username, password}
 * @returns {Promise<Object>} - Response with success message
 */
export async function register(credentials) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(credentials)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Fetch all tasks for the authenticated user
 * @param {string} token - JWT authentication token
 * @returns {Promise<Array>} - List of tasks
 */
export async function fetchTasks(token) {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      headers: {'Authorization': token}
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Fetch tasks error:', error);
    throw error;
  }
}

/**
 * Create a new task
 * @param {Object} data - Task data {title, description}
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} - Created task
 */
export async function createTask(data, token) {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(data)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Create task error:', error);
    throw error;
  }
}

/**
 * Update an existing task
 * @param {number} id - Task ID
 * @param {Object} data - Updated task data
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} - Updated task
 */
export async function updateTask(id, data, token) {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(data)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Update task error:', error);
    throw error;
  }
}

/**
 * Delete a task
 * @param {number} id - Task ID to delete
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} - Success message
 */
export async function deleteTask(id, token) {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {'Authorization': token}
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Delete task error:', error);
    throw error;
  }
}