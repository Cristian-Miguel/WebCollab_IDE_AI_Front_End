export interface CreateSessionPayload {
  nombre: string;
  descripcion?: string;
}

export interface ParticipantUser {
  id: string;
  email: string;
  fullName: string;
}

export interface SessionParticipantModel {
  id: string;
  usuarioId: string;
  sesionId: string;
  rol: 'PROPIETARIO' | 'COLABORADOR';
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  usuario?: ParticipantUser;
}

export interface SessionModel {
  id: string;
  nombre: string;
  descripcion?: string | null;
  propietarioId: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
}

export interface JoinSessionResponseData {
  session: SessionModel;
  participant: SessionParticipantModel;
  participants: SessionParticipantModel[];
}

export interface DashboardState {
  sessions: SessionModel[];
  currentSession: SessionModel | null;
  participants: SessionParticipantModel[];
  loading: boolean;
  error: string | null;
}
