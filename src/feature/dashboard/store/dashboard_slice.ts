import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { dashboardService } from '../services/dashboard_service';
import type {
  CreateSessionPayload,
  DashboardState,
  JoinSessionResponseData,
  SessionModel,
  SessionParticipantModel,
} from '../types/session_types';

const initialState: DashboardState = {
  sessions: [],
  currentSession: null,
  participants: [],
  loading: false,
  error: null,
};

export const createSession = createAsyncThunk<SessionModel, CreateSessionPayload, { rejectValue: string }>(
  'dashboard/createSession',
  async (payload: CreateSessionPayload, { rejectWithValue }) => {
    try {
      return await dashboardService.createSession(payload);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message = err.response?.data?.message || err.message || 'Error al crear la sesión';
      return rejectWithValue(message);
    }
  }
);

export const joinSession = createAsyncThunk<JoinSessionResponseData, string, { rejectValue: string }>(
  'dashboard/joinSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      return await dashboardService.joinSession(sessionId);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      if (err.response?.status === 403) {
        return rejectWithValue(
          err.response?.data?.message || 'La sesión ha alcanzado el límite máximo de 4 usuarios activos.'
        );
      }
      const message = err.response?.data?.message || err.message || 'Error al unirse a la sesión';
      return rejectWithValue(message);
    }
  }
);

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
    setCurrentSession: (state, action: PayloadAction<SessionModel | null>) => {
      state.currentSession = action.payload;
    },
    updateParticipantsList: (state, action: PayloadAction<SessionParticipantModel[]>) => {
      state.participants = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSession.fulfilled, (state, action: PayloadAction<SessionModel>) => {
        state.loading = false;
        state.currentSession = action.payload;
        state.sessions.unshift(action.payload);
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Fallo al crear la sesión';
      })
      .addCase(joinSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinSession.fulfilled, (state, action: PayloadAction<JoinSessionResponseData>) => {
        state.loading = false;
        state.currentSession = action.payload.session;
        state.participants = action.payload.participants;
      })
      .addCase(joinSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'No fue posible unirse a la sesión';
      });
  },
});

export const { clearDashboardError, setCurrentSession, updateParticipantsList } = dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;
