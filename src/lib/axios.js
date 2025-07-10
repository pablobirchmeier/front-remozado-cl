import axios from 'axios';
import router from '../router';
import { useUserStore } from '../stores/user';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Interceptar respuestas
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const userStore = useUserStore();
      userStore.logout(); // limpia el token
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

// Interceptar peticiones para agregar token si existe
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
