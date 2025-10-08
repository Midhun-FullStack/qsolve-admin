import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If the request data is FormData, allow the browser/axios to set the
    // Content-Type (including multipart boundary) by removing the default
    // application/json header.
    if (config.data && typeof FormData !== 'undefined' && config.data instanceof FormData) {
      // Remove any explicit Content-Type header so the browser sets it correctly
      if (config.headers) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
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
      localStorage.removeItem('adminToken');
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export default api;