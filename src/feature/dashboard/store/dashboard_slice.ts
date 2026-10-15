import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { dashboardService } from '../services/dashboard_service';
import type { CreateSessionPayload, DashboardState, SessionModel } from '../types/session_types';

const initialState: DashboardState = {
  sessions: [],
  currentSession: null,
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
      });
  },
});

export const { clearDashboardError, setCurrentSession } = dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;
