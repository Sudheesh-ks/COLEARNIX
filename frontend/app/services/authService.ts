import axios from 'axios';
import { api } from '../axios/axiosInstance';
import { AUTH_API } from '../constants/apiRoutes';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const authService = {
  logout: async () => {
    return await api.post(AUTH_API.LOGOUT);
  },
  
  refresh: async () => {
    return await axios.post(`${backendUrl}${AUTH_API.REFRESH_TOKEN}`, {}, { withCredentials: true });
  }
};
