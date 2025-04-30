const API_URL = 'http://localhost:8080/api';
    export async function login(credentials) {
      return fetch(`${API_URL}/auth/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(credentials) })
        .then(res => res.text());
    }
    export async function register(credentials) {
      return fetch(`${API_URL}/auth/register`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(credentials) })
        .then(res => res.text());
    }
    export async function fetchTasks(token) {
      return fetch(`${API_URL}/tasks`, { headers: {'Authorization': token} }).then(res => res.json());
    }
    export async function createTask(data, token) {
      return fetch(`${API_URL}/tasks`, { method:'POST', headers: {'Content-Type':'application/json','Authorization':token}, body: JSON.stringify(data) }).then(res => res.json());
    }
    export async function updateTask(id, data, token) {
      return fetch(`${API_URL}/tasks/${id}`, { method:'PUT', headers: {'Content-Type':'application/json','Authorization':token}, body: JSON.stringify(data) }).then(res => res.json());
    }
    export async function deleteTask(id, token) {
      return fetch(`${API_URL}/tasks/${id}`, { method:'DELETE', headers: {'Authorization':token} });
    }