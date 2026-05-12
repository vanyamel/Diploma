import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 20000,
});

//JWT Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('lm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

//Problems
export const problemsApi = {
  generate:    (category, level) => api.post('/problems/generate', { category, level }),
  checkAnswer: (problemId, answer, hintsUsed = 0) =>
    api.post(`/problems/${problemId}/check`, { answer, hintsUsed }),
};

//Auth
export const authApi = {
  register: (email, username, password) =>
    api.post('/auth/register', { email, username, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

//Leaderboard
export const leaderboardApi = {
  get: () => api.get('/leaderboard'),
};

//Favorites
export const favoritesApi = {
  getFavorites: () => api.get('/favorites'),
  toggleFavorite: (problemId) => api.post('/favorites/toggle', { problemId }),
  checkFavorite: (problemId) => api.get(`/favorites/${problemId}/check`),
};

//Admin
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
