import { type AuthState, type AuthAction, AUTH_ACTION_TYPES, type AuthUser } from './auth_types';
import { saveTokens, clearTokens } from '../../../core/config/jwt_manage';

// Estado inicial: Intenta cargar el estado de la sesión
const initialUser: AuthUser | null = null; 

export const authInitialState: AuthState = {
  isAuthenticated: false,
  user: initialUser,
  loading: false,
  error: null,
};

export const authReducer = (state: AuthState = authInitialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AUTH_ACTION_TYPES.LOGIN_SUCCESS:
      saveTokens(action.payload.accessToken, action.payload.refreshToken);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null,
      };
      
    case AUTH_ACTION_TYPES.LOGOUT:
      clearTokens();
      return {
        ...authInitialState,
      };

    case AUTH_ACTION_TYPES.LOADING:
      return {
        ...state,
        loading: action.payload,
      };
      
    case AUTH_ACTION_TYPES.ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};