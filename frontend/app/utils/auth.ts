import { storage } from './storage';

export const AUTH_KEYS = {
  ACCESS_TOKEN: 'userAccessToken',
  ADMIN_ACCESS_TOKEN: 'adminAccessToken',
  REFRESH_TOKEN: 'userRefreshToken',
  USER_DATA: 'userData',
};

export const authUtils = {
  getToken: (isAdmin = false) => storage.get<string>(isAdmin ? AUTH_KEYS.ADMIN_ACCESS_TOKEN : AUTH_KEYS.ACCESS_TOKEN),
  
  setToken: (token: string, isAdmin = false) => 
    storage.set(isAdmin ? AUTH_KEYS.ADMIN_ACCESS_TOKEN : AUTH_KEYS.ACCESS_TOKEN, token),
  
  clearSession: (isAdmin = false) => {
    storage.remove(isAdmin ? AUTH_KEYS.ADMIN_ACCESS_TOKEN : AUTH_KEYS.ACCESS_TOKEN);
    if (!isAdmin) storage.remove(AUTH_KEYS.USER_DATA);
  },

  isAuthenticated: (isAdmin = false) => !!storage.get<string>(isAdmin ? AUTH_KEYS.ADMIN_ACCESS_TOKEN : AUTH_KEYS.ACCESS_TOKEN),
};
