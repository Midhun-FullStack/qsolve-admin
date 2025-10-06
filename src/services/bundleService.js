import api from './api';

export const bundleService = {
  getAllBundles: async () => {
    const response = await api.get('/bundles');
    return response.data;
  },

  getBundleById: async (id) => {
    const response = await api.get(`/bundles/${id}`);
    return response.data;
  },

  createBundle: async (bundleData) => {
    const response = await api.post('/bundles/create', bundleData);
    return response.data;
  },

  updateBundle: async (id, bundleData) => {
    const response = await api.put(`/bundles/${id}`, bundleData);
    return response.data;
  },

  deleteBundle: async (id) => {
    const response = await api.delete(`/bundles/${id}`);
    return response.data;
  },
};