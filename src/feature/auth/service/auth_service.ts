import axios from 'axios';
import api, { refreshAccessToken } from '../../../core/config/api_manage';
import { API_ROUTES } from '../../../core/const/api_routes';
import { decodeTokenPayload } from '../../../core/config/jwt_manage';
import type { AuthUser, AuthResponseData, LoginInputs, RegisterInputs } from '../model/auth_model';
import type { SuccessResponse } from '../../../core/model/success_response';

export interface ResetPasswordInputs {
  password: string;
  token: string;
}

interface ApiErrorBody {
  message?: string;
  body?: { message?: string };
  errors?: Array<{ msg?: string; message?: string }>;
}

const getResponseMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError<ApiErrorBody>(error)) return fallback;

  const body = error.response?.data;
  return body?.message || body?.body?.message || body?.errors?.[0]?.msg ||
    body?.errors?.[0]?.message || fallback;
};

const makeAuthUser = (accessToken: string): AuthUser => {
  const user = decodeTokenPayload(accessToken);
  if (!user) {
    throw new Error('El servidor devolvió una sesión inválida. Intenta iniciar sesión nuevamente.');
  }
  return user;
};

const readAccessToken = <T>(response: SuccessResponse<T>): T => {
  if (!response.data) {
    throw new Error('El servidor devolvió una respuesta incompleta.');
  }
  return response.data;
};

export const getAuthErrorMessage = (error: unknown, fallback: string): string =>
  getResponseMessage(error, fallback);

export const login = async (credentials: LoginInputs): Promise<{ user: AuthUser; accessToken: string }> => {
  try {
    const response = await api.post<SuccessResponse<AuthResponseData>>(API_ROUTES.LOGIN, credentials);
    const { accessToken } = readAccessToken(response.data);
    return { user: makeAuthUser(accessToken), accessToken };
  } catch (error) {
    throw new Error(getResponseMessage(error, 'No fue posible iniciar sesión. Verifica tus datos e inténtalo de nuevo.'));
  }
};

export const registerUser = async (
  userData: RegisterInputs,
): Promise<{ user: AuthUser; accessToken: string }> => {
  try {
    const response = await api.post<SuccessResponse<AuthResponseData>>(API_ROUTES.REGISTER, userData);
    const { accessToken } = readAccessToken(response.data);
    return { user: makeAuthUser(accessToken), accessToken };
  } catch (error) {
    throw new Error(getResponseMessage(error, 'No fue posible crear tu cuenta. Revisa tus datos e inténtalo de nuevo.'));
  }
};

let restoringSession: Promise<{ user: AuthUser; accessToken: string }> | null = null;

export const restoreSession = (): Promise<{ user: AuthUser; accessToken: string }> => {
  if (!restoringSession) {
    restoringSession = refreshAccessToken()
      .then((accessToken) => ({ user: makeAuthUser(accessToken), accessToken }))
      .finally(() => {
        restoringSession = null;
      });
  }
  return restoringSession;
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await api.post(API_ROUTES.RESET_PASSWORD_TOKEN, { email });
  } catch (error) {
    throw new Error(getResponseMessage(error, 'No fue posible procesar la solicitud. Inténtalo de nuevo.'));
  }
};

export const resetPassword = async (data: ResetPasswordInputs): Promise<void> => {
  try {
    await api.post(API_ROUTES.CHANGE_PASSWORD_TOKEN, {
      password: data.password,
      token: data.token,
    });
  } catch (error) {
    throw new Error(getResponseMessage(error, 'No fue posible cambiar la contraseña. Solicita un nuevo enlace e inténtalo otra vez.'));
  }
};

export const validateEmail = async (token: string): Promise<void> => {
  try {
    await api.post(API_ROUTES.VALIDATE_EMAIL_TOKEN, { token });
  } catch (error) {
    throw new Error(getResponseMessage(error, 'No fue posible validar el correo. El enlace pudo haber expirado o ya fue utilizado.'));
  }
};

export const resendValidationEmail = async (): Promise<void> => {
  try {
    await api.post(API_ROUTES.RESEND_VALIDATE_EMAIL);
  } catch (error) {
    throw new Error(getResponseMessage(error, 'No fue posible reenviar el correo. Inténtalo de nuevo.'));
  }
};

export const logoutToken = async (): Promise<void> => {
  try {
    await api.post(API_ROUTES.LOGOUT_TOKEN);
  } catch (error) {
    throw new Error(getResponseMessage(error, 'No fue posible cerrar la sesión en el servidor. Inténtalo nuevamente.'));
  }
};
