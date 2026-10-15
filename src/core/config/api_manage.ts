import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { AUTH_ACTION_TYPES } from '../../feature/auth/context/auth_types';
import { store } from './store';
import { clearTokens, getAccessToken, saveTokens } from './jwt_manage';
import { API_ROUTES } from '../const/api_routes';
import type { SuccessResponse } from '../model/success_response';

interface AccessTokenResponse {
  accessToken: string;
}

interface RetriableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

const api: AxiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const isAuthEntryRequest = (url?: string): boolean =>
  [API_ROUTES.LOGIN, API_ROUTES.REGISTER, API_ROUTES.REFRESH_TOKEN].includes(url || '');

const notifySessionExpired = (): void => {
  clearTokens();
  store.dispatch({ type: AUTH_ACTION_TYPES.LOGOUT });
};

const refreshAccessToken = async (): Promise<string> => {
  const response = await axios.post<SuccessResponse<AccessTokenResponse>>(
    API_ROUTES.REFRESH_TOKEN,
    {},
    { withCredentials: true },
  );
  const token = response.data.data?.accessToken;
  if (!token) {
    throw new Error('El servidor no devolvió un token de acceso.');
  }
  saveTokens(token);
  return token;
};

const processQueue = (error: AxiosError | null, token?: string): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
    else reject(new Error('No se pudo renovar la sesión.'));
  });
  failedQueue = [];
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequest | undefined;
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEntryRequest(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api.request(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;
    try {
      const token = await refreshAccessToken();
      processQueue(null, token);
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return await api.request(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError);
      notifySessionExpired();
      window.dispatchEvent(new Event('auth:session-expired'));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export { refreshAccessToken };
export default api;
