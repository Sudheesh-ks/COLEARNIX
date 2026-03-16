import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const isAdminRequest = config.url?.startsWith('/api/admin');
    const tokenKey = isAdminRequest ? 'adminAccessToken' : 'userAccessToken';
    const token = typeof window !== 'undefined' ? localStorage.getItem(tokenKey) : null;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (originalRequest.url?.includes('/refresh-token')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
            }
            return api(originalRequest as any);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const isAdminRequest = originalRequest.url?.startsWith('/api/admin');
      const refreshUrl = isAdminRequest ? `${backendUrl}/api/admin/refresh-token` : `${backendUrl}/api/auth/refresh-token`;
      const tokenKey = isAdminRequest ? 'adminAccessToken' : 'userAccessToken';

      try {
        const { data } = await axios.post(
          refreshUrl,
          {},
          { withCredentials: true }
        );

        if (data && data.token) {
          localStorage.setItem(tokenKey, data.token);
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = 'Bearer ' + data.token;
          }
          processQueue(null, data.token);
          return api(originalRequest as any);
        }
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem(tokenKey);
        if (typeof window !== 'undefined') {
          const isLoginPage = window.location.pathname.includes('/login');
          if (!isLoginPage) {
            window.location.href = isAdminRequest ? '/admin/login' : '/login';
          }
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
