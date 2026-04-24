import { api } from '../axios/axiosInstance';
import { USER_API } from '../constants/apiRoutes';

export const userService = {
  getProfile: async () => {
    return await api.get(USER_API.GET_PROFILE);
  },
  
  updateProfile: async (updateData: { name?: string; gender?: string; dob?: string; image?: string }) => {
    return await api.put(USER_API.UPDATE_PROFILE, updateData);
  }
};
