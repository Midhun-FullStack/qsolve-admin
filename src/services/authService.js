import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('adminToken');
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },
};