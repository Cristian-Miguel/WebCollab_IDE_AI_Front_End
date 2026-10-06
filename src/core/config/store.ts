import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { authReducer } from '../../feature/auth/context/auth_reducer';
// ... otros reducers que puedas tener

const rootReducer = combineReducers({
  auth: authReducer,
  // ... añadir más reducers aquí
});

// Define el Store (Configuración actual)
export const store = configureStore({
  reducer: rootReducer,
  // ...
});

// 1. Define el tipo RootState a partir del rootReducer
export type RootState = ReturnType<typeof rootReducer>;

// 2. Define el tipo AppDispatch para tipificar el useDispatch
export type AppDispatch = typeof store.dispatch;