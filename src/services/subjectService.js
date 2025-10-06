import api from './api';

export const subjectService = {
  getAllSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },

  createSubject: async (subjectData) => {
    const response = await api.post('/subjects/create', subjectData);
    return response.data;
  },

  updateSubject: async (id, subjectData) => {
    const response = await api.put(`/subjects/${id}`, subjectData);
    return response.data;
  },

  deleteSubject: async (id) => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  },
};