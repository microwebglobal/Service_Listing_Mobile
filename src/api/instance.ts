import axios from 'axios';
import {API_BASE} from '@env';
import {getRefreshToken, getToken} from '../utils/token-storage';

export const instance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshToken = async () => {
  const refreshTokenFromKeychain = await getRefreshToken();
  try {
    const response = await instance.post('/refresh', {
      refreshToken: refreshTokenFromKeychain,
    });
    return response.data.refreshToken;
  } catch (error: any) {
    throw error;
  }
};

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
        const newToken = await refreshToken();
        instance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
  },
);
