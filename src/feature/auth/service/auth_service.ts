import api from '../../../core/config/api_manage';
import { API_ROUTES } from '../../../core/const/api_routes';
import { type AuthUser } from '../context/auth_types';
import { decodeToken } from '../../../core/config/jwt_manage';
import {  type AuthResponseData } from '../model/auth_model';
import { type LoginInputs, type RegisterInputs } from '../model/auth_model';
import { handleErrorResponse, displayErrorToUser } from '../../../core/config/error_manage';
import type { SuccessResponse } from '../../../core/model/success_response';
import type { ErrorResponse } from '../../../core/model/error_response';

export interface ForgotPasswordInputs {
    email: string;
}

export interface ResetPasswordInputs {
    password: string;
    confirmPassword: string;
    token: string;
}

/**
 * Procesa la decodificación del token y extrae la información necesaria para Redux.
 * @param token Access Token
 * @returns Los datos del usuario tipados para Redux (AuthUser).
 */
const processTokenToUser = (token: string): AuthUser => {
  const payload = decodeToken(token);
  
  if (!payload) {
    throw new Error('No se pudo decodificar el token para el usuario.');
  }

  const user: AuthUser = {
    uuid: payload.sub,
    sub: payload.sub,
    email: payload.email,
    imageUrl: payload.imageUrl,
    role: payload.role,
    aud: payload.aud,
    iss: payload.iss,
    type: payload.type,
  };

  return user;
};

/**
 * Realiza la petición de inicio de sesión.
 * @param credentials El correo y la contraseña.
 * @param loginSuccess Función de Redux para actualizar el estado tras el éxito.
 * @returns true si el login fue exitoso.
 */
export const login = async (
  credentials: LoginInputs,
  loginSuccess: (user: AuthUser, accessToken: string, refreshToken: string) => void
): Promise<boolean> => {
  try {
    // La petición ya incluye la gestión de tokens y URL base gracias a api_manage.ts
    const response = await api.post<SuccessResponse<AuthResponseData>>(
      API_ROUTES.LOGIN, 
      credentials
    );

    const { accessToken, refreshToken } = response.data.data;

    // 1. Decodificar el token para obtener los datos del usuario
    const user = processTokenToUser(accessToken);

    // 2. Actualizar el estado global con el usuario y guardar los tokens
    loginSuccess(user, accessToken, refreshToken);
    
    return true;

  } catch (error: any) {
    // Obtener el mensaje de error del backend o usar uno genérico
    // const errorMessage = error.response?.data?.mensaje || 'Error desconocido al iniciar sesión.';
    // console.error('Login fallido:', errorMessage);
    
    const feError = handleErrorResponse(error);
    displayErrorToUser(feError);
    
    return false;
  }
};

/**
 * Realiza la petición de registro de usuario.
 * @param userData Todos los datos requeridos para el registro[cite: 212].
 * @returns true si el registro fue exitoso.
 */
export const registerUser = async (userData: RegisterInputs): Promise<boolean> => {
    try {
        await api.post(API_ROUTES.REGISTER, userData);

        // Si el registro es exitoso, el backend debe enviar el correo de validación[cite: 218].
        // Normalmente no se loguea al usuario después del registro; se le dirige a la página de validación.
        return true;

    } catch (error: any) {
        const errorMessage = error.response?.data?.mensaje || 'Error desconocido al registrar usuario.';
        console.error('Registro fallido:', errorMessage);
        
        // Aquí podrías despachar una acción de Redux ERROR
        
        return false;
    }
}

/**
 * Realiza la petición para solicitar el restablecimiento de contraseña.
 * @param email El correo del usuario.
 * @returns true si el correo existe y el email fue enviado.
 */
export const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
        // Asume la ruta 'auth/forgot-password'
        await api.post(`${API_ROUTES.RESET_PASSWORD_TOKEN}`, { email });
        
        return true;

    } catch (error: any) {
        // Manejo de error si el correo no existe o hay error de servidor
        console.error('Solicitud de restablecimiento fallida:', error.response?.data?.mensaje || 'Error desconocido.');
        return false;
    }
};

/**
 * Envía la nueva contraseña y el token para restablecerla.
 * @param data Contraseña, confirmación y token.
 * @returns true si la contraseña se cambió con éxito.
 */
export const resetPassword = async (data: ResetPasswordInputs): Promise<SuccessResponse<string> | ErrorResponse> => {
    try {
        const response = await api.post(`${API_ROUTES.CHANGE_PASSWORD_TOKEN}`, { 
          password: data.password,
          token: data.token
        });

        const result = response.data as SuccessResponse<string>;

        return result;
    } catch (error: any) {
        console.error('Restablecimiento de contraseña fallido:', error.response?.data?.mensaje || 'Error desconocido.');
        return error.response?.data || {
          code: 'E0001',
          message: 'Error al restablecer la contraseña.'
        };
    }
};

/**
 * Solicita al backend el reenvío del email de validación al usuario actualmente logueado.
 * ⚠️ NOTA: Debes asegurarte de que el API_ROUTES.RESEND_VALIDATE_EMAIL esté definido y apunte al endpoint correcto.
 * @returns true si el correo fue enviado con éxito.
 */
export const resendValidationEmail = async (): Promise<boolean> => {
    try {
        // Asumimos que no necesita datos adicionales ya que el usuario está autenticado 
        // y el backend puede extraer el correo de su token JWT.
        await api.post(`${API_ROUTES.RESEND_VALIDATE_EMAIL}`); 
        return true; 
    } catch (error: any) {
        console.error('Fallo al reenviar correo de validación:', error.response?.data?.message || 'Error desconocido.');
        // Puedes agregar lógica para mostrar el error al usuario aquí si usas un hook global de error.
        return false;
    }
};

/** Realiza la petición de cierre de sesión.
 * @returns true si el logout fue exitoso.
 */
export const logoutToken = async (): Promise<boolean> => {
  try {
    await api.post(API_ROUTES.LOGOUT_TOKEN);
    return true;
  } catch (error: any) {
    console.error('Logout fallido:', error.response?.data?.message || 'Error desconocido al cerrar sesión.');
    const feError = handleErrorResponse(error);
    displayErrorToUser(feError);
    
    return false;
  }
};