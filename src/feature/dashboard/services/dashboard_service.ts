import api from '../../../core/config/api_manage';
import { API_ROUTES } from '../../../core/const/api_routes';
import type { SuccessResponse } from '../../../core/model/success_response';
import type { CreateSessionPayload, SessionModel } from '../types/session_types';

export const dashboardService = {
  createSession: async (payload: CreateSessionPayload): Promise<SessionModel> => {
    const response = await api.post<SuccessResponse<SessionModel>>(
      API_ROUTES.SESSIONS,
      payload
    );
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al crear la sesión colaborativa');
    }
    return response.data.data;
  },
};
