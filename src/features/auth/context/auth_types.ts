import type { AuthUser } from '../model/auth_model';

export { type AuthUser } from '../model/auth_model';

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export const AUTH_ACTION_TYPES = {
  LOGIN_SUCCESS: 'AUTH/LOGIN_SUCCESS',
  LOGOUT: 'AUTH/LOGOUT',
  LOADING: 'AUTH/LOADING',
  ERROR: 'AUTH/ERROR',
  READY: 'AUTH/READY',
} as const;

export type AuthAction =
  | { type: typeof AUTH_ACTION_TYPES.LOGIN_SUCCESS; payload: { user: AuthUser; accessToken: string } }
  | { type: typeof AUTH_ACTION_TYPES.LOGOUT }
  | { type: typeof AUTH_ACTION_TYPES.LOADING; payload: boolean }
  | { type: typeof AUTH_ACTION_TYPES.ERROR; payload: string | null }
  | { type: typeof AUTH_ACTION_TYPES.READY };
