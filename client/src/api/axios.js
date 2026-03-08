import axios from 'axios';

const api = axios.create({
  // Si existe la variable en el entorno, úsala; si no, usa localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

export default api;