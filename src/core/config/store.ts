import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { authReducer } from '../../feature/auth/context/auth_reducer';
import { dashboardReducer } from '../../feature/dashboard/store/dashboard_slice';
import { editorReducer } from '../../features/editor/store/editorSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  editor: editorReducer,
});

// Define el Store (Configuración actual)
export const store = configureStore({
  reducer: rootReducer,
});

// 1. Define el tipo RootState a partir del rootReducer
export type RootState = ReturnType<typeof rootReducer>;

// 2. Define el tipo AppDispatch para tipificar el useDispatch
export type AppDispatch = typeof store.dispatch;
