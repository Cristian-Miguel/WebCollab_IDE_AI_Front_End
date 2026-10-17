import React from 'react';
import { Box, Typography, Button, Paper, Grid, Chip } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';

interface SuggestionDiffProps {
  originalCode: string;
  suggestedCode: string;
  language: string;
  onApply: (code: string) => void;
  onDismiss: () => void;
}

/**
 * Componente SuggestionDiff que muestra la comparación entre el código actual
 * y la sugerencia de la IA junto al botón "Aplicar al Editor" (HU-16).
 */
export const SuggestionDiff: React.FC<SuggestionDiffProps> = ({
  originalCode,
  suggestedCode,
  language,
  onApply,
  onDismiss,
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CompareArrowsRoundedIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2" fontWeight={700}>
            Comparación de Sugerencia IA
          </Typography>
          <Chip size="small" label={language.toUpperCase()} color="info" variant="outlined" />
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<CloseRoundedIcon />}
            onClick={onDismiss}
            sx={{ textTransform: 'none' }}
          >
            Descartar
          </Button>
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={<CheckCircleRoundedIcon />}
            onClick={() => onApply(suggestedCode)}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            Aplicar al Editor
          </Button>
        </Box>
      </Box>

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
            Código Actual
          </Typography>
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: '#0f172a',
              color: '#cbd5e1',
              fontSize: '0.78rem',
              fontFamily: 'monospace',
              maxHeight: 200,
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {originalCode}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="caption" color="success.main" fontWeight={700} sx={{ display: 'block', mb: 0.5 }}>
            Sugerencia IA Propuesta
          </Typography>
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: '#064e3b',
              color: '#ecfdf5',
              fontSize: '0.78rem',
              fontFamily: 'monospace',
              maxHeight: 200,
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {suggestedCode}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SuggestionDiff;
