import { api } from '../axios/axiosInstance';
import { ROOM_API } from '../constants/apiRoutes';

export const roomService = {
  createRoom: async (pax: number) => {
    return await api.post(ROOM_API.CREATE, { pax });
  },
  getRoom: async (roomId: string) => {
    return await api.get(ROOM_API.GET_BY_ID(roomId));
  },
  joinRoom: async (roomId: string) => {
    return await api.post(ROOM_API.JOIN(roomId));
  },
  leaveRoom: async (roomId: string) => {
    return await api.post(ROOM_API.LEAVE(roomId));
  },
  executeCode: async (language: string, version: string, code: string) => {
    return await api.post(ROOM_API.EXECUTE, { language, version, code });
  }
};
