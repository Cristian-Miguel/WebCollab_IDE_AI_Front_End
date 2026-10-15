export interface CreateSessionPayload {
  nombre: string;
  descripcion?: string;
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

export interface DashboardState {
  sessions: SessionModel[];
  currentSession: SessionModel | null;
  loading: boolean;
  error: string | null;
}
