import axios from 'axios';

const API_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-access-token'] = token;
  }
  return config;
});

// Response interceptor to handle unauthorized errors (session expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or invalid. Clearing local state.");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use window.location to force redirect to login if we're not already there
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  validateSession: () => api.get('/validate-session'),
  updateProfile: (data) => api.post('/update_profile', data),
  logout: async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      console.error("Logout notification failed", e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getRoles: () => api.get('/roles'),
  getDepartments: () => api.get('/departments'),
};

export const fileService = {
  getFiles: () => api.get('/files'),
  getFileById: (id) => api.get(`/file/${id}`),
  getStats: () => api.get('/stats'),
  downloadPDF: (id) => api.get(`/download-pdf/${id}`, { responseType: 'blob' }),
};

export const adminService = {
  getLogs: () => api.get('/logs'),
  getUsers: () => api.get('/admin/users'),
  getStats: () => api.get('/admin/stats'),
  getFiles: () => api.get('/admin/files'),
  addFile: (data) => api.post('/admin/add-file', data),
  getRoles: () => api.get('/admin/roles'),
  addRole: (name) => api.post('/admin/roles', { name }),
  deleteRole: (id) => api.delete(`/admin/roles/${id}`),
  getDepartments: () => api.get('/admin/departments'),
  addDepartment: (name) => api.post('/admin/departments', { name }),
  deleteDepartment: (id) => api.delete(`/admin/departments/${id}`),
  getSessions: () => api.get('/admin/sessions'),
  deleteFile: (id) => api.delete(`/admin/files/${id}`),
};

export const aiService = {
  getSummary: (fileId) => api.post('/ai-summary', { file_id: fileId }),
  chat: (query) => api.post('/ai-chat', { query }),
};

export default api;
