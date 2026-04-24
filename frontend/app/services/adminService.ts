import { api } from '../axios/axiosInstance';
import { ADMIN_API } from '../constants/apiRoutes';

export const adminService = {
  login: (credentials: any) => api.post(ADMIN_API.LOGIN, credentials),
  logout: () => api.post(ADMIN_API.LOGOUT),
  refresh: () => api.post(ADMIN_API.REFRESH_TOKEN),
  getUsers: (page: number, limit: number) => api.get(ADMIN_API.GET_USERS(page, limit)),
  toggleBlockUser: (userId: string) => api.patch(ADMIN_API.TOGGLE_BLOCK(userId)),
};
