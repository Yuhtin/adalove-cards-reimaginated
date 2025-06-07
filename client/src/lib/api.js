import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  },

  async register(userData) {  
    const response = await api.post('/auth/register', userData);

    const { token, user } = response.data;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  },

  async changePassword(passwordData) {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
};

export const studentActivities = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const response = await api.get(`/student-activities?${params}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/student-activities/${id}`);
    return response.data;
  },

  async updateStatus(id, statusTypeId) {
    const response = await api.patch(`/student-activities/${id}/status`, { statusTypeId });
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/student-activities/${id}`, data);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/student-activities', data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/student-activities/${id}`);
    return response.data;
  },

  async getStats() {
    const response = await api.get('/student-activities/stats');
    return response.data;
  }
};

export const sections = {
  async getAll() {
    const response = await api.get('/sections');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/sections/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/sections', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/sections/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/sections/${id}`);
    return response.data;
  },

  async getActivities(id) {
    const response = await api.get(`/sections/${id}/activities`);
    return response.data;
  },

  async importFromAdaLove(data) {
    const response = await api.post('/sections/import-adalove', data);
    return response.data;
  }
};

export const types = {
  async getActivityTypes() {
    const response = await api.get('/student-activities/activity-types');
    return response.data;
  },

  async getStatusTypes() {
    const response = await api.get('/student-activities/status-types');
    return response.data;
  }
};

// Removed cards API - use studentActivities instead

export const users = {
  async getAll() {
    const response = await api.get('/users');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async updateIcon(id, iconUrl) {
    const response = await api.patch(`/users/${id}/icon`, { iconUrl });
    return response.data;
  },

  async getUserWithCards(id) {
    const response = await api.get(`/users/${id}/cards`);
    return response.data;
  }
};

export default api; 