import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL + '/api'
  : '/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mindspace_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mindspace_token');
      localStorage.removeItem('mindspace_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;