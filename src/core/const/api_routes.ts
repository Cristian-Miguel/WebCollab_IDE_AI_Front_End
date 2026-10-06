
export const API_BASE_URL = import.meta.env.VITE_APP_ENVIRONMENT === 'DEVELOP' ? import.meta.env.VITE_APP_API_ENDPOINT_URL_DEVELOP :
    import.meta.env.VITE_APP_ENVIRONMENT === 'TEST' ? import.meta.env.VITE_APP_API_ENDPOINT_URL_TEST :
    import.meta.env.VITE_APP_ENVIRONMENT === 'QA' ? import.meta.env.VITE_APP_API_ENDPOINT_URL_QA :
    import.meta.env.VITE_APP_API_ENDPOINT_URL_PRODUCTION;

export const API_ROUTES = {
  // Rutas del módulo de autenticación
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
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
};