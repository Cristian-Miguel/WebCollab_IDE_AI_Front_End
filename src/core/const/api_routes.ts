const environment = import.meta.env.VITE_APP_ENVIRONMENT?.toUpperCase() || 'DEVELOP';

export const API_BASE_URL = (
  environment === 'TEST' ? import.meta.env.VITE_APP_API_ENDPOINT_URL_TEST :
  environment === 'QA' ? import.meta.env.VITE_APP_API_ENDPOINT_URL_QA :
  environment === 'PRODUCTION' ? import.meta.env.VITE_APP_API_ENDPOINT_URL_PRODUCTION :
  import.meta.env.VITE_APP_API_ENDPOINT_URL_DEVELOP
)?.replace(/\/+$/, '') || 'http://localhost:3000/api/v1';

export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/v1$/, '');
export const YJS_WS_BASE_URL = SERVER_BASE_URL.replace(/^http/, 'ws') + '/yjs-ws';

export const API_ROUTES = {
  // Rutas del módulo de autenticación
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  LOGOUT_TOKEN: `${API_BASE_URL}/auth/logout`,
  RESET_PASSWORD_TOKEN: `${API_BASE_URL}/auth/password/request-reset`,
  CHANGE_PASSWORD_TOKEN: `${API_BASE_URL}/auth/password/change`,
  VALIDATE_EMAIL_TOKEN: `${API_BASE_URL}/auth/email/validate`,
  RESEND_VALIDATE_EMAIL: `${API_BASE_URL}/auth/email/validate/request`,

  USER_BY_ID: `${API_BASE_URL}/user/:uuid`, // necesita el UUID al final
  CREATE_USER: `${API_BASE_URL}/user`,
  UPDATE_USER: `${API_BASE_URL}/user`,
  DELETE_USER: `${API_BASE_URL}/user`,
  PAGINATE_USERS: `${API_BASE_URL}/user/paginate`,

  // Rutas de sesiones colaborativas
  SESSIONS: `${API_BASE_URL}/sessions`,
  JOIN_SESSION: (sessionId: string) => `${API_BASE_URL}/sessions/${sessionId}/join`,

  // Rutas de asistencia con Inteligencia Artificial (HU-16)
  AI_SUGGEST: `${API_BASE_URL}/ai/suggest`,
};
