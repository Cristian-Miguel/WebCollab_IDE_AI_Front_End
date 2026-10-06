import api from '../../../core/config/api_manage';
import { API_ROUTES } from '../../../core/const/api_routes';
import { type SuccessResponse } from '../../../core/model/success_response';
import { type User } from '../model/user_model';

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

    } catch (error: any) {
        console.error(`Fallo al obtener datos del usuario ${uuid}:`, error.response?.data?.message || 'Error desconocido.');
        throw new Error(error.response?.data?.message || 'No se pudo cargar el perfil del usuario.');
    }
};