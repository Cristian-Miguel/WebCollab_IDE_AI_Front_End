import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { aiService } from '../services/aiService';
import type { AIAssistantState, AISuggestPayload, AISuggestionModel } from '../types/ai_types';

const initialState: AIAssistantState = {
  currentSuggestion: null,
  history: [],
  loading: false,
  error: null,
};

export const requestAISuggestion = createAsyncThunk<
  AISuggestionModel,
  AISuggestPayload,
  { rejectValue: string }
>(
  'aiAssistant/requestAISuggestion',
  async (payload: AISuggestPayload, { rejectWithValue }) => {
    try {
      return await aiService.suggestCode(payload);
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };
      if (err.response?.status === 429) {
        return rejectWithValue(
          err.response?.data?.message ||
            'Has alcanzado el límite de peticiones a la IA (429 Too Many Requests). Intenta en un minuto.'
        );
      }
      const message =
        err.response?.data?.message ||
        err.message ||
        'Error al solicitar sugerencia a la Inteligencia Artificial';
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
    },
    handleApiError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestAISuggestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestAISuggestion.fulfilled, (state, action: PayloadAction<AISuggestionModel>) => {
        state.loading = false;
        state.currentSuggestion = action.payload;
        state.history.unshift(action.payload);
      })
      .addCase(requestAISuggestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Fallo al consultar el asistente de IA';
      });
  },
});

export const { clearAISuggestion, clearAIError, handleApiError } = aiSlice.actions;
export const aiReducer = aiSlice.reducer;
export default aiReducer;
