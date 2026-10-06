import { type UserTokenPayload } from '../model/auth_model';

export interface AuthUser extends Omit<UserTokenPayload, 'exp'> {
  uuid: string;
}

// 2. Tipos de Estado de Redux
export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

// 3. Tipos de Acciones
export const AUTH_ACTION_TYPES = {
  LOGIN_SUCCESS: 'AUTH/LOGIN_SUCCESS',
  LOGOUT: 'AUTH/LOGOUT',
  LOADING: 'AUTH/LOADING',
  ERROR: 'AUTH/ERROR',
  // Podrías añadir REFRESH_SUCCESS, UPDATE_USER_DATA, etc.
} as const;

export type AuthAction =
  | { type: typeof AUTH_ACTION_TYPES.LOGIN_SUCCESS; payload: { user: AuthUser; accessToken: string, refreshToken: string } }
  | { type: typeof AUTH_ACTION_TYPES.LOGOUT }
  | { type: typeof AUTH_ACTION_TYPES.LOADING; payload: boolean }
  | { type: typeof AUTH_ACTION_TYPES.ERROR; payload: string | null };