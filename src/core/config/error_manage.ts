import { AxiosError } from 'axios';
import { AUTH_ACTION_TYPES } from '../../feature/auth/context/auth_types'; // Para errores de sesión
import { store } from './store'; // Para acceso directo al store de Redux

// --- INTERFACES DEL MODELO DE ERROR DEL BACKEND ---

export interface BackendErrorModel {
  codigo: number; // Código HTTP o código de error interno
  mensaje: string; // Mensaje legible para el usuario
  stack_tree?: string; // Stack trace completo (solo en entorno de desarrollo/log)
}

// --- TIPOS DE ERRORES FRONTEND (Para simplificar la interfaz) ---

export interface FrontendError {
  message: string;
  statusCode: number;
  isFatal: boolean; // Indica si es un error que requiere cerrar sesión o recargar
}

// --- CONSTANTES DE MENSAJES DE ERROR ---

const DEFAULT_ERROR_MESSAGE = 'Ha ocurrido un error inesperado. Inténtalo más tarde.';
const CONNECTION_ERROR_MESSAGE = 'No se pudo conectar con el servidor. Verifica tu conexión.';

// ----------------------------------------
// --- FUNCIONES DE MANEJO DE ERRORES ---
// ----------------------------------------

/**
 * Traduce un objeto de error de Axios a un formato estándar de FrontendError.
 * @param error El objeto de error de Axios.
 * @returns Un objeto de error estandarizado para el frontend.
 */
export const handleErrorResponse = (error: AxiosError<BackendErrorModel>): FrontendError => {
  let errorMessage = DEFAULT_ERROR_MESSAGE;
  let statusCode = 500;
  let isFatal = false;
  
  // 1. Manejo de errores de respuesta (el servidor respondió)
  if (error.response) {
    const backendData = error.response.data;
    statusCode = error.response.status;

    // A. Error 401 (Unauthorized) - Debe ser manejado por api_manage.ts para refresco, 
    //    pero si llega aquí, es un fallo final.
    if (statusCode === 401) {
      errorMessage = 'Tu sesión ha expirado o no es válida. Por favor, inicia sesión de nuevo.';
      isFatal = true;
      // Forzar el logout si el interceptor de Axios falló
      store.dispatch({ type: AUTH_ACTION_TYPES.LOGOUT }); 
    } 
    // B. Errores del cliente (4xx, ej. 400 Bad Request, 403 Forbidden)
    else if (statusCode >= 400 && statusCode < 500) {
      // Usamos el mensaje del backend si está disponible
      errorMessage = backendData?.mensaje || 'Error en la solicitud. Revisa los datos ingresados.';
    }
    // C. Errores del servidor (5xx)
    else if (statusCode >= 500) {
      errorMessage = 'Error interno del servidor. Estamos trabajando para solucionarlo.';
      isFatal = true;
    }
    // D. Usar el mensaje específico del backend si existe
    if (backendData?.mensaje) {
        errorMessage = backendData.mensaje;
    }

  // 2. Manejo de errores de red (el servidor no respondió)
  } else if (error.request) {
    errorMessage = CONNECTION_ERROR_MESSAGE;
    statusCode = 0; // Código 0 para error de red/sin respuesta
    isFatal = true;
  } 
  
  // 3. Otros errores (ej. error en la configuración de Axios)
  else {
    errorMessage = error.message;
  }

  // Loguear el error completo en consola para debugging (alineado con winston/winston_manage.ts)
  console.error(`[FE-ERROR] Status: ${statusCode}, Message: ${errorMessage}`, error);

  return {
    message: errorMessage,
    statusCode: statusCode,
    isFatal: isFatal,
  };
};

/**
 * Función global para mostrar un error al usuario (ej. usando un toast o snackbar de MUI).
 * Esto evita repetir la lógica de visualización en cada componente.
 * @param error El objeto de error estandarizado o un mensaje simple.
 */
export const displayErrorToUser = (error: FrontendError | string): void => {
  const message = typeof error === 'string' ? error : error.message;

  // --- Lógica de visualización (Ejemplo de TOAST/ALERT) ---
  
  // NOTA: Para implementar esto completamente, necesitarías un componente global 
  //       (ej. AlertMessageFormat.tsx) y un Context/Redux para manejar su estado.

  // Por ahora, solo usamos la consola:
  console.log(`[ALERTA USUARIO] Error: ${message}`); 
  
  // En una aplicación real:
  // dispatch(showToast({ type: 'error', message })); 
};


// ----------------------------------------
// --- UTILIDADES ---
// ----------------------------------------

/**
 * Clase personalizada para representar errores de la aplicación que se deben manejar.
 */
export class AppError extends Error {
    constructor(message: string, code: number = 500) {
        super(message);
        this.name = 'AppError';
    }
}