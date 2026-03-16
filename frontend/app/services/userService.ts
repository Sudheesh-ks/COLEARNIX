import { api } from '../axios/axiosInstance';

export const userService = {
  getProfile: async () => {
    return await api.get('/api/user/profile');
  },
  
  updateProfile: async (updateData: { name?: string; gender?: string; dob?: string; image?: string }) => {
    return await api.put('/api/user/profile', updateData);
  }
};
