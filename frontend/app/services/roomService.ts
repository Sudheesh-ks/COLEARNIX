import { api } from '../axios/axiosInstance';

export const roomService = {
  createRoom: async (pax: number) => {
    return await api.post('/api/room/create', { pax });
  },
  getRoom: async (roomId: string) => {
    return await api.get(`/api/room/${roomId}`);
  },
  joinRoom: async (roomId: string) => {
    return await api.post(`/api/room/${roomId}/join`);
  },
  leaveRoom: async (roomId: string) => {
    return await api.post(`/api/room/${roomId}/leave`);
  }
};
