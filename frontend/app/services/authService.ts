import axios from 'axios';
import { api } from '../axios/axiosInstance';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const authService = {
  logout: async () => {
    return await api.post('/api/auth/logout');
  },
  
  refresh: async () => {
    return await axios.post(`${backendUrl}/api/auth/refresh-token`, {}, { withCredentials: true });
  }
};
