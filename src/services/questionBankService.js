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
    const response = await api.post('/question-banks/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateQuestionBank: async (id, formData) => {
    const response = await api.put(`/question-banks/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteQuestionBank: async (id) => {
    const response = await api.delete(`/question-banks/${id}`);
    return response.data;
  },
};