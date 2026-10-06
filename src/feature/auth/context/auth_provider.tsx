import React, { useMemo, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, type RootState, type AppDispatch } from '../../../core/config/store'; 
import { ThemeProvider } from '@mui/material/styles';
import { createCustomTheme } from '../../../core/config/theme_manage';
import { AuthContext } from './auth_context'; // <-- Componente Context
import { type AuthUser, type AuthAction, AUTH_ACTION_TYPES } from './auth_types';
import { checkAndRefreshTokens } from '../../../core/config/jwt_manage';

// El componente principal que envuelve toda la App
interface AppProvidersProps {
  children: React.ReactNode;
}

const theme = createCustomTheme();

// ----------------------------------------------------
// 1. Componente que maneja la lógica del AuthContext (DENTRO del Redux Provider)
const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 1. Obtener estado y dispatcher de Redux (usando RootState y AppDispatch)
    const authState = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    
    // 2. Definir funciones de acción
    const loginSuccess = (user: AuthUser, accessToken: string, refreshToken: string) => {
        dispatch({ 
            type: AUTH_ACTION_TYPES.LOGIN_SUCCESS, 
            payload: { user, accessToken, refreshToken } 
        } as AuthAction);
    };

    const logout = () => {
        dispatch({ type: AUTH_ACTION_TYPES.LOGOUT });
    };

    // 3. Lógica de inicialización: Revisar tokens al cargar la app
    useEffect(() => {
        // Esta es la función que evita la sesión "fantasma" al cargar
        checkAndRefreshTokens(dispatch); 
    }, [dispatch]);
    
    // 4. Crear el valor del Contexto (userRole expuesto)
    const contextValue = useMemo(() => ({
        ...authState,
        dispatch: dispatch as React.Dispatch<AuthAction>, // Tipado forzado para el Contexto
        loginSuccess,
        logout,
        userRole: authState.user?.role || 'public', 
    }), [authState, dispatch]);

    // 5. Provee el Contexto a los hijos
    return (
        <AuthContext.Provider value={contextValue}> 
            {children}
        </AuthContext.Provider>
    );
};
// ----------------------------------------------------


const AuthProvider: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    // 1. Redux Provider
    <Provider store={store}>
      {/* 2. MUI Theme Provider */}
      <ThemeProvider theme={theme}>
        {/* 3. El Contexto de Autenticación */}
        <AuthContextProvider>
            {children} 
        </AuthContextProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default AuthProvider;