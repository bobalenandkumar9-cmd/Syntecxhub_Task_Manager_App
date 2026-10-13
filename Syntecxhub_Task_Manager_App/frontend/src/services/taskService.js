import api from './api';

export const fetchTasks = async (params = {}) => {
  const { data } = await api.get('/tasks', { params });
  return data;
};

export const createTask = async (task) => {
  const { data } = await api.post('/tasks', task);
  return data;
};

export const updateTask = async (id, updates) => {
  const { data } = await api.put(`/tasks/${id}`, updates);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};
