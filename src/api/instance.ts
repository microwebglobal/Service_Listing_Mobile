import axios from 'axios';
import {API_BASE} from '@env';
import { getRefreshToken, getToken } from '../utils/token-storage';
import { refreshTokens } from '../redux/user/user.action';

export const instance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use(async config => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        refreshTokens();
        const newToken = await getRefreshToken();
        instance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
  },
);
