import type { SessionParticipantModel } from '../../../feature/dashboard/types/session_types';

export type PresenceParticipant = SessionParticipantModel;

export interface PresenceState {
  onlineUsers: PresenceParticipant[];
  isConnected: boolean;
  syncLatencyMs: number;
}
