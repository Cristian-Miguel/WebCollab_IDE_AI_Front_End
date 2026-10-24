import type { SessionParticipantModel } from '../../../feature/dashboard/types/session_types';

export type PresenceParticipant = SessionParticipantModel;

export const WS_DISCONNECT_LIMIT_REACHED = 'WS Disconnect: Limit reached';

export interface PresenceState {
  onlineUsers: PresenceParticipant[];
  isConnected: boolean;
  syncLatencyMs: number;
  connectionError: string | null;
}
