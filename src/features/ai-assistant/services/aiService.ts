import api from '../../../core/config/api_manage';
import { API_ROUTES } from '../../../core/const/api_routes';
import type { SuccessResponse } from '../../../core/model/success_response';
import type { AISuggestPayload, AISuggestionModel } from '../types/ai_types';

export const aiService = {
  suggestCode: async (payload: AISuggestPayload): Promise<AISuggestionModel> => {
    const response = await api.post<SuccessResponse<AISuggestionModel>>(
      API_ROUTES.AI_SUGGEST,
      payload
    );

    if (!response.data.data) {
      throw new Error(response.data.message || 'No se pudo obtener la sugerencia de IA');
    }

    return response.data.data;
  },
};

export default aiService;
