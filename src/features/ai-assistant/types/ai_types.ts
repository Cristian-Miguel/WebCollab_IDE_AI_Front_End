import type { EditorLanguage } from '../../editor/types/editor_types';

export interface AISuggestPayload {
  contextoCodigo: string;
  lenguaje: EditorLanguage;
  promptUsuario?: string;
  sesionId?: string;
}

export interface AISuggestionModel {
  id: string;
  sesionId: string;
  usuarioId: string;
  prompt: string;
  respuesta: string;
  sugerencia: string;
  lenguaje: EditorLanguage;
  createdAt: string;
}

export interface AIAssistantState {
  currentSuggestion: AISuggestionModel | null;
  history: AISuggestionModel[];
  loading: boolean;
  error: string | null;
  isRateLimited?: boolean;
}
