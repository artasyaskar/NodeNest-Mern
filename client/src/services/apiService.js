import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const projectService = {
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data.projects;
  },

  getProject: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data.project;
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data.project;
  }
};

export const taskService = {
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/tasks?${params}`);
    return response.data.tasks;
  },

  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data.task;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data.task;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data.task;
  },

  addComment: async (id, content) => {
    const response = await api.post(`/tasks/${id}/comments`, { content });
    return response.data.task;
  }
};

export const userService = {
  getUsers: async (page = 1, limit = 10) => {
    const response = await api.get(`/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data.user;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.user;
  }
};

export default api;
