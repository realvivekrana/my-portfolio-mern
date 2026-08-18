import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Har request ke sath automatically token bhejne ke liye (agar login hai to)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;