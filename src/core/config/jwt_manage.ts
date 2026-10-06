import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { type AuthUser, type UserTokenPayload } from '../../feature/auth/model/auth_model';
import { AUTH_ACTION_TYPES } from '../../feature/auth/context/auth_types';
import type { AppDispatch } from './store';

const ACCESS_TOKEN_KEY = 'accessToken';
// const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Guarda los tokens de acceso y refresh en el almacenamiento local (localStorage).
 * @param accessToken El token principal (base).
 * @param refreshToken El token para refrescar la sesión.
 */
export const saveTokens = (accessToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  // localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken); , refreshToken: string
};

/**
 * Obtiene el token de acceso desde el almacenamiento local.
 * @returns El token de acceso como string, o null si no existe.
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Obtiene el refresh token desde el almacenamiento local.
 * @returns El refresh token como string, o null si no existe.
 
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};
*/

/**
 * Elimina ambos tokens del almacenamiento local (usado para Logout).
 */
export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  // localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Decodifica el token de acceso para obtener los datos del usuario y la expiración.
 * @param token El token JWT a decodificar.
 * @returns El payload decodificado o null si la decodificación falla.
 */
export const decodeToken = (token: string): UserTokenPayload | null => {
  try {
    return jwtDecode<UserTokenPayload>(token);
  } catch (error) {
    console.error("Error decodificando el token:", error);
    return null;
  }
};

/**
 * Verifica si el token ha expirado.
 * @param token El token JWT a verificar.
 * @returns true si el token ha expirado, false en caso contrario.
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    // Si no hay token o no tiene tiempo de expiración, asumimos que no es válido
    return true;
  }

  // Compara la hora actual (en segundos) con la hora de expiración del token (exp)
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};

/**
 * Decodifica un token y extrae el payload.
 */
export const decodeTokenPayload = (token: string): AuthUser | null => {
  try {
    const payload = jwtDecode<UserTokenPayload>(token);
    
    // Verificación de expiración (aunque el backend debería hacerlo, es buena práctica)
    const currentTime = Date.now() / 1000;
    if (payload.exp < currentTime) {
      console.warn('Token expirado al decodificar.');
      return null;
    }
    
    // Mapeo al tipo AuthUser
    return {
      uuid: payload.sub,
      email: payload.email,
      role: payload.role,
      imageUrl: payload.imageUrl,
    } as AuthUser;
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    return null;
  }
};

/**
 * Función que chequea el Refresh Token al iniciar la app. (REQUERIMIENTO PENDIENTE: Llamar al endpoint /refresh)
 */
export const checkAndRefreshTokens = async (dispatch: AppDispatch) => {
    // const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    
    if (!accessToken) {
        // No hay tokens, la sesión es inexistente. || !refreshToken
        return;
    }

    const decodedUser = decodeTokenPayload(accessToken);

    if (decodedUser) {
        // Opción 1: El access token es válido (aunque puede expirar pronto). Restaura la sesión.
        dispatch({ 
            type: AUTH_ACTION_TYPES.LOGIN_SUCCESS, 
            payload: { 
                user: decodedUser, 
                accessToken, 
                // refreshToken 
            } 
        });
        return;
    } 
    
    // Opción 2: El access token expiró, pero hay refresh token. Intentar refrescar (Lógica Backend Pendiente)
    // NOTE: Aquí se haría la llamada al endpoint /refresh (ej. auth_service.ts)
    console.log('Access token expirado. Intentando usar Refresh Token...');
    // const newTokens = await refreshServiceCall(refreshToken); 
    
    // Si la llamada al servicio refresh es exitosa:
    /* if (newTokens.success) {
        dispatch({ 
            type: AUTH_ACTION_TYPES.LOGIN_SUCCESS, 
            payload: { user: newTokens.user, ...newTokens.tokens } 
        });
    } else {
        dispatch({ type: AUTH_ACTION_TYPES.LOGOUT });
    }
    */
    
    // Por simplicidad, si el access token es inválido y no hacemos la llamada refresh, cerramos sesión.
    dispatch({ type: AUTH_ACTION_TYPES.LOGOUT }); 
};

/**
 * Valida si un token es un JWT válido (formato y expiración).
 * NOTA: Esta función solo valida la estructura (secreto no) y la expiración.
 * @param token El token de restablecimiento de contraseña a validar.
 * @returns 'valid', 'expired', o 'invalid_format'.
 */
export const validateResetToken = (token: string): 'valid' | 'expired' | 'invalid_format' => {
    try {
        // Intenta decodificar. Si falla, el formato es incorrecto.
        const decoded = jwtDecode<JwtPayload>(token);

        // Si no hay payload o no tiene el campo de expiración, es inválido.
        if (!decoded || !decoded.exp) {
            return 'invalid_format';
        }

        // Verificar expiración (tiempo actual en segundos)
        const currentTime = Date.now() / 1000; 
        if (decoded.exp < currentTime) {
            return 'expired'; // Token expirado
        }

        // Token válido y no expirado
        return 'valid';
    } catch (error) {
        // jwtDecode lanza un error si el formato del token (a.b.c) es incorrecto.
        return 'invalid_format';
    }
};

/**
 * Valida si un token de VALIDACIÓN de correo es un JWT válido (formato y expiración).
 * @param token El token a validar.
 * @returns 'valid', 'expired', o 'invalid_format'.
 */
export const validateEmailToken = (token: string): 'valid' | 'expired' | 'invalid_format' => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (!decoded || !decoded.exp) {
            return 'invalid_format';
        }

        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            return 'expired'; // Token expirado (válido por 15 días )
        }

        return 'valid';
    } catch (error) {
        return 'invalid_format';
    }
};