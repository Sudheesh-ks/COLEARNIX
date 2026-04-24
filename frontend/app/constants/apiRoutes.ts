export const AUTH_API = {
  GOOGLE: '/api/auth/google',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh-token',
};

export const USER_API = {
  GET_PROFILE: '/api/user/profile',
  UPDATE_PROFILE: '/api/user/profile',
};

export const ROOM_API = {
  CREATE: '/api/room/create',
  GET_BY_ID: (id: string) => `/api/room/${id}`,
  JOIN: (id: string) => `/api/room/${id}/join`,
  LEAVE: (id: string) => `/api/room/${id}/leave`,
  EXECUTE: '/api/room/execute',
};

export const ADMIN_API = {
  LOGIN: '/api/admin/login',
  LOGOUT: '/api/admin/logout',
  REFRESH_TOKEN: '/api/admin/refresh-token',
  GET_USERS: (page: number, limit: number) => `/api/admin/users?page=${page}&limit=${limit}`,
  TOGGLE_BLOCK: (userId: string) => `/api/admin/users/${userId}/block`,
};
