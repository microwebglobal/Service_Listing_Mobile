import axios from 'axios';
import {API_BASE} from '@env';
import {getToken} from '../utils/token-storage';

console.log(API_BASE);

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
