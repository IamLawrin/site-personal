import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lwr_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lwr_admin_token');
      localStorage.removeItem('lwr_admin_session');
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================

export const authAPI = {
  login: async (password) => {
    const response = await api.post('/admin/login', { password });
    if (response.data.success && response.data.token) {
      localStorage.setItem('lwr_admin_token', response.data.token);
    }
    return response.data;
  },
  
  verify: async () => {
    try {
      const response = await api.get('/admin/verify');
      return response.data.valid;
    } catch {
      return false;
    }
  },
  
  logout: () => {
    localStorage.removeItem('lwr_admin_token');
    localStorage.removeItem('lwr_admin_session');
  },
};

// ==================== PROJECTS ====================

export const projectsAPI = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/projects', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// ==================== ALBUMS ====================

export const albumsAPI = {
  getAll: async () => {
    const response = await api.get('/albums');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/albums', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/albums/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/albums/${id}`);
    return response.data;
  },
};

// ==================== MEDIA ====================

export const mediaAPI = {
  getAll: async (albumId = null) => {
    const url = albumId ? `/media?albumId=${albumId}` : '/media';
    const response = await api.get(url);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/media', data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/media/${id}`);
    return response.data;
  },
};

// ==================== REVIEWS ====================

export const reviewsAPI = {
  getAll: async () => {
    const response = await api.get('/reviews');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

// ==================== CONTACT ====================

export const contactAPI = {
  getAll: async () => {
    const response = await api.get('/contact');
    return response.data;
  },
  
  send: async (data) => {
    const response = await api.post('/contact', data);
    return response.data;
  },
  
  markRead: async (id) => {
    const response = await api.put(`/contact/${id}/read`);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },
};

// ==================== PROFILE ====================

export const profileAPI = {
  get: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  
  update: async (data) => {
    const response = await api.put('/profile', data);
    return response.data;
  },
};

// ==================== FILE UPLOAD ====================

export const uploadAPI = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
