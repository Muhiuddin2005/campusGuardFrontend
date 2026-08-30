import axios from 'axios';
import { deleteSecureItem, getSecureItem } from '../storage/secureStorage';

const DEV_API_HOST = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.101:8000';
const BASE_URL = `${DEV_API_HOST}/api/v1`;

export const anonClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const authClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

authClient.interceptors.request.use(
  async (config) => {
    const token = await getSecureItem('campusguard_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await deleteSecureItem('campusguard_auth_token');
      await deleteSecureItem('campusguard_auth_user');
    }
    return Promise.reject(error);
  }
);
