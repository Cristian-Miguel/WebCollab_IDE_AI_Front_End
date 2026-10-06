import axios, { type AxiosInstance, type AxiosResponse, AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, saveTokens, clearTokens } from './jwt_manage';
import { API_ROUTES, API_BASE_URL } from '../const/api_routes';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void; config: InternalAxiosRequestConfig }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token && prom.config.headers) {
      prom.config.headers.Authorization = `Bearer ${token}`;
      api.request(prom.config).then(prom.resolve).catch(prom.reject);
    }
  });
  failedQueue = [];
};

// Interceptor para inyectar el Access Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores y refresco de token
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    // La condición clave: es un 401 y no es la petición de refresco
    if (originalRequest && error.response && error.response.status === 401 && originalRequest.url !== API_ROUTES.REFRESH_TOKEN) {
      
      // const currentRefreshToken = getRefreshToken();
      
      // if (!currentRefreshToken) {
      //   clearTokens();
      //   // Redireccionar al login (Esta lógica debe ir en un lugar central, ej. Redux/Context)
      //   window.location.href = '/login'; 
      //   return Promise.reject(error);
      // }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_ROUTES.REFRESH_TOKEN}`,
          // { refreshToken: currentRefreshToken },
          { 
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
          
        );

        //, refreshToken: newRefreshToken
        const { token: newAccessToken } = response.data.data; 

        saveTokens(newAccessToken);//, newRefreshToken
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api.request(originalRequest);

      } catch (refreshError: any) {
        clearTokens();
        processQueue(refreshError);
        // Redireccionar al login
        // window.location.href = '/login'; 
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;