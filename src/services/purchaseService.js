import api from './api';

export const purchaseService = {
  getAllPurchases: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  getPurchaseById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  updatePurchaseStatus: async (id, status) => {
    const response = await api.put(`/payments/${id}`, { paymentDone: status });
    return response.data;
  },
};