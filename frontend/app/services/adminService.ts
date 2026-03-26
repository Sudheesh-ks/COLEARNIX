import { api } from '../axios/axiosInstance';

export const adminService = {
  login: (credentials: any) => api.post('/api/admin/login', credentials),
  logout: () => api.post('/api/admin/logout'),
  refresh: () => api.post('/api/admin/refresh-token'),
  getUsers: (page: number, limit: number) => api.get(`/api/admin/users?page=${page}&limit=${limit}`),
  toggleBlockUser: (userId: string) => api.patch(`/api/admin/users/${userId}/block`),
};
