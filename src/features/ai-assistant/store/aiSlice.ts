import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { aiService } from '../services/aiService';
import type { AIAssistantState, AISuggestPayload, AISuggestionModel } from '../types/ai_types';

export const AI_RATE_LIMIT_ALERT_MESSAGE =
  'Has excedido el límite de peticiones a la Inteligencia Artificial (máx. 5 por minuto). Intenta nuevamente en un minuto.';

const initialState: AIAssistantState = {
  currentSuggestion: null,
  history: [],
  loading: false,
  error: null,
  isRateLimited: false,
};

export const requestAISuggestion = createAsyncThunk<
  AISuggestionModel,
  AISuggestPayload,
  { rejectValue: string }
>(
  'aiAssistant/requestAISuggestion',
  async (payload: AISuggestPayload, { dispatch, rejectWithValue }) => {
    try {
      return await aiService.suggestCode(payload);
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; data?: { message?: string; code?: string } };
        message?: string;
      };
      if (err.response?.status === 429 || err.response?.data?.code === 'E4001') {
        const rateLimitMsg =
          err.response?.data?.message || AI_RATE_LIMIT_ALERT_MESSAGE;
        dispatch(aiSlice.actions.handleApiError(rateLimitMsg));
        return rejectWithValue(rateLimitMsg);
      }
      const message =
        err.response?.data?.message ||
        err.message ||
        'Error al solicitar sugerencia a la Inteligencia Artificial';
      dispatch(aiSlice.actions.handleApiError(message));
      return rejectWithValue(message);
    }
  }
);

export const aiSlice = createSlice({
  name: 'aiAssistant',
  initialState,
  reducers: {
    clearAISuggestion: (state) => {
      state.currentSuggestion = null;
    },
    clearAIError: (state) => {
      state.error = null;
      state.isRateLimited = false;
    },
    handleApiError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isRateLimited =
        action.payload.toLowerCase().includes('límite') ||
        action.payload.includes('429');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestAISuggestion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isRateLimited = false;
      })
      .addCase(requestAISuggestion.fulfilled, (state, action: PayloadAction<AISuggestionModel>) => {
        state.loading = false;
        state.currentSuggestion = action.payload;
        state.history.unshift(action.payload);
        state.isRateLimited = false;
      })
      .addCase(requestAISuggestion.rejected, (state, action) => {
        state.loading = false;
        const msg = action.payload || 'Fallo al consultar el asistente de IA';
        state.error = msg;
        state.isRateLimited =
          msg.toLowerCase().includes('límite') || msg.includes('429');
      });
  },
});

export const { clearAISuggestion, clearAIError, handleApiError } = aiSlice.actions;
export const aiReducer = aiSlice.reducer;
export default aiReducer;
