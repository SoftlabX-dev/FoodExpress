// api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Votre URL Laravel
  withCredentials: true, // ESSENTIEL pour les cookies
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export default api;