import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  AlertTitle,
  CircularProgress,
  Chip,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useAppDispatch, useAppSelector } from '../../../core/hooks/redux_hooks';
import {
  requestAISuggestion,
  clearAISuggestion,
  clearAIError,
  handleApiError,
  AI_RATE_LIMIT_ALERT_MESSAGE,
} from '../store/aiSlice';
import { updateFileContent } from '../../editor/store/editorSlice';
import { getOrCreateSessionYDoc } from '../../preview/utils/yjsDocRegistry';
import { SuggestionDiff } from './SuggestionDiff';

interface AIAssistantPanelProps {
  sessionId?: string;
}

/**
 * Panel de Asistencia mediante Inteligencia Artificial (HU-16 y HU-27).
 * Permite solicitar sugerencias de código para el archivo activo, aplicarlas al editor y Y.Doc,
 * y captura errores 429 Too Many Requests mostrando una alerta informativa mediante `handleApiError`.
 */
export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ sessionId }) => {
  const dispatch = useAppDispatch();
  const { activeFile, files } = useAppSelector((state) => state.editor);
  const { currentSuggestion, loading, error, isRateLimited } = useAppSelector(
    (state) => state.aiAssistant
  );
  const [promptUsuario, setPromptUsuario] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const currentFile = files[activeFile];

  const handleRequestSuggestion = async () => {
    setAppliedSuccess(false);
    dispatch(clearAIError());

    const resultAction = await dispatch(
      requestAISuggestion({
        contextoCodigo: currentFile.content,
        lenguaje: currentFile.language,
        promptUsuario: promptUsuario.trim() || undefined,
        sesionId: sessionId,
      })
    );

    if (requestAISuggestion.rejected.match(resultAction)) {
      dispatch(
        handleApiError(
          resultAction.payload || AI_RATE_LIMIT_ALERT_MESSAGE
        )
      );
    }
  };

  const handleApplyToEditor = (suggestedCode: string) => {
    dispatch(
      updateFileContent({
        fileName: activeFile,
        content: suggestedCode,
      })
    );

    if (sessionId) {
      const ydoc = getOrCreateSessionYDoc(sessionId);
      const ytext = ydoc.getText(activeFile);
      ydoc.transact(() => {
        ytext.delete(0, ytext.length);
        ytext.insert(0, suggestedCode);
      });
    }

    dispatch(clearAISuggestion());
    setAppliedSuccess(true);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeRoundedIcon color="secondary" />
          <Typography variant="subtitle1" fontWeight={700}>
            Asistente de Código con IA
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            size="small"
            color={isRateLimited ? 'warning' : 'default'}
            variant="outlined"
            label="Límite: 5 pet./min"
          />
          <Chip
            size="small"
            color="secondary"
            variant="outlined"
            label={`Contexto: ${currentFile.label} (${currentFile.language.toUpperCase()})`}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          fullWidth
          size="small"
          label="Instrucción para la IA (opcional)"
          placeholder="Ej: Agrega validación de formulario o mejora el diseño..."
          value={promptUsuario}
          onChange={(e) => setPromptUsuario(e.target.value)}
          disabled={loading}
        />
        <Button
          variant="contained"
          color="secondary"
          startIcon={
            loading ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeRoundedIcon />
          }
          onClick={handleRequestSuggestion}
          disabled={loading}
          sx={{ borderRadius: 2, px: 2.5, textTransform: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}
        >
          {loading ? 'Generando...' : 'Pedir Sugerencia IA'}
        </Button>
      </Box>

      {error && (
        <Alert
          severity={isRateLimited ? 'warning' : 'error'}
          onClose={() => dispatch(clearAIError())}
        >
          {isRateLimited && (
            <AlertTitle>Límite de Peticiones Excedido (429 Too Many Requests)</AlertTitle>
          )}
          {error}
        </Alert>
      )}

      {appliedSuccess && (
        <Alert severity="success" onClose={() => setAppliedSuccess(false)}>
          ¡Sugerencia de IA aplicada exitosamente al editor ({currentFile.label})!
        </Alert>
      )}

      {currentSuggestion && (
        <SuggestionDiff
          originalCode={currentFile.content}
          suggestedCode={currentSuggestion.sugerencia || currentSuggestion.respuesta}
          language={currentSuggestion.lenguaje || currentFile.language}
          onApply={handleApplyToEditor}
          onDismiss={() => dispatch(clearAISuggestion())}
        />
      )}
    </Paper>
  );
};

export default AIAssistantPanel;
