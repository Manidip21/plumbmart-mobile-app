import axios from 'axios';

import { getToken } from '../utils/authStorage';

const API_URLS = {
  emulator: 'http://10.0.2.2:5000',
  device: 'http://192.168.29.183:5000',
};

// Change this value when switching between emulator and physical device.
const CURRENT_ENVIRONMENT = 'device';

const API_BASE_URL = API_URLS[CURRENT_ENVIRONMENT];

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;
