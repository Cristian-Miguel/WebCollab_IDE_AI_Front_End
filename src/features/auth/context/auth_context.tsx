import React from 'react';
import { type AuthState, type AuthAction } from './auth_types';
import { type AuthUser } from '../model/auth_model';

// Define la forma de lo que expondrá el Context
export interface AuthContextValue extends AuthState {
  // Las propiedades de AuthState (isAuthenticated, user, loading, error) se heredan

  // Funciones y Dispatcher
  dispatch: React.Dispatch<AuthAction>;
  loginSuccess: (user: AuthUser, accessToken: string) => void;
  logout: () => void;
  userRole: string; 
}

// Define el valor por defecto
const initialContextValue: AuthContextValue = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  dispatch: () => {},
  loginSuccess: () => {},
  logout: () => {},
  userRole: 'public',
};

// Crea el Contexto
export const AuthContext = React.createContext<AuthContextValue>(initialContextValue);