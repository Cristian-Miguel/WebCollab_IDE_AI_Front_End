import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PresenceParticipant, PresenceState } from '../types/presence_types';

const initialState: PresenceState = {
  onlineUsers: [],
  isConnected: false,
  syncLatencyMs: 18,
  connectionError: null,
};

export const presenceSlice = createSlice({
  name: 'presence',
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<PresenceParticipant[]>) => {
      state.onlineUsers = action.payload;
    },
    setPresenceConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setSyncLatencyMs: (state, action: PayloadAction<number>) => {
      state.syncLatencyMs = action.payload;
    },
    setPresenceError: (state, action: PayloadAction<string | null>) => {
      state.connectionError = action.payload;
    },
  },
});

export const {
  setOnlineUsers,
  setPresenceConnected,
  setSyncLatencyMs,
  setPresenceError,
} = presenceSlice.actions;

export const presenceReducer = presenceSlice.reducer;
export default presenceReducer;
