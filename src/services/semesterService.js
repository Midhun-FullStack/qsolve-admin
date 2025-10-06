import api from './api';

export const semesterService = {
  getAllSemesters: async () => {
    const response = await api.get('/semesters');
    return response.data;
  },

  createSemester: async (semesterData) => {
    const response = await api.post('/semesters/create', semesterData);
    return response.data;
  },

  updateSemester: async (id, semesterData) => {
    const response = await api.put(`/semesters/${id}`, semesterData);
    return response.data;
  },

  deleteSemester: async (id) => {
    const response = await api.delete(`/semesters/${id}`);
    return response.data;
  },
};