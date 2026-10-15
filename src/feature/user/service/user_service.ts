import api from '../../../core/config/api_manage';
import { API_ROUTES } from '../../../core/const/api_routes';
import { type User } from '../model/user_model';
import axios from 'axios';

/**
 * Obtiene todos los datos del perfil de un usuario por su UUID.
 * Llama al endpoint USER_BY_ID.
 * @param uuid El UUID del usuario a buscar.
 * @returns Los datos completos del usuario (UserFullData).
 */
export const getUserByUuid = async (uuid: string): Promise<User> => {
    try {
        const url = API_ROUTES.USER_BY_ID.replace(':uuid', uuid);
        
        const response = await api.get(url);
        const result = response.data.body.data;
        return result as User;

    } catch (error: unknown) {
        const message = axios.isAxiosError<{ message?: string }>(error)
            ? error.response?.data?.message
            : undefined;
        const errorMessage = message || 'No se pudo cargar el perfil del usuario.';

        console.error(`Fallo al obtener datos del usuario ${uuid}:`, errorMessage);
        throw new Error(errorMessage);
    }
};