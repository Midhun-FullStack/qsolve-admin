import api from './api';

export const questionBankService = {
  getAllQuestionBanks: async () => {
    const response = await api.post('/question-banks');
    return response.data;
  },

  getQuestionBankById: async (id) => {
    const response = await api.get(`/question-banks/${id}`);
    return response.data;
  },

  createQuestionBank: async (formData) => {
    // Let the browser set the Content-Type (with boundary) when sending FormData
    const response = await api.post('/question-banks/create', formData);
    return response.data;
  },

  updateQuestionBank: async (id, formData) => {
    // Let the browser set the Content-Type header for FormData
    const response = await api.put(`/question-banks/${id}`, formData);
    return response.data;
  },

  deleteQuestionBank: async (id) => {
    const response = await api.delete(`/question-banks/${id}`);
    return response.data;
  },
};