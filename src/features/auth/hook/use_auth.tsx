import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../../core/config/store';
import { type AuthUser, type AuthAction, AUTH_ACTION_TYPES } from '../context/auth_types';

/**
 * Hook personalizado para acceder y manipular el estado de autenticación de Redux.
 */
export const useAuth = () => {
  const dispatch: AppDispatch = useDispatch();
  
  // Accede al estado de Redux de forma sencilla (lee el slice 'auth')
  const { isAuthenticated, user, loading, error } = useSelector((state: RootState) => state.auth);

  /**
   * Despacha la acción de LOGOUT.
   * La limpieza de tokens y el reseteo del estado es manejado por auth_reducer.tsx.
   */
  const logout = () => {
    dispatch({ type: AUTH_ACTION_TYPES.LOGOUT });
  };
  
  /**
   * Despacha la acción de LOGIN_SUCCESS.
   * Guarda los tokens y establece el estado de autenticación. Es llamado por auth_service.ts.
   */
  const loginSuccess = (user: AuthUser, accessToken: string) => {
      dispatch({ 
          type: AUTH_ACTION_TYPES.LOGIN_SUCCESS, 
          payload: { user, accessToken } 
      } as AuthAction);
  };

  /**
   * Despacha una acción para establecer el estado de carga (loading).
   */
  const setLoading = (isLoading: boolean) => {
    dispatch({ type: AUTH_ACTION_TYPES.LOADING, payload: isLoading });
  };
  
  /**
   * Despacha una acción para establecer un mensaje de error.
   */
  const setError = (errorMessage: string | null) => {
    dispatch({ type: AUTH_ACTION_TYPES.ERROR, payload: errorMessage });
  };

  return {
    isAuthenticated,
    user,
    userRole: user?.role,
    loading,
    error,
    logout,
    loginSuccess,
    setLoading,
    setError,
    dispatch, 
  };
};