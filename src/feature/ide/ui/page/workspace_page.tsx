import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';

export const WorkspacePage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate('/dashboard')}
            variant="outlined"
            size="small"
          >
            Volver al Dashboard
          </Button>
          <Typography variant="h5" fontWeight={700}>
            Espacio de Trabajo Colaborativo
          </Typography>
        </Box>
        <Chip
          icon={<GroupsRoundedIcon />}
          label={`Sesión: ${sessionId || 'Desconocida'}`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CodeRoundedIcon sx={{ fontSize: 60, color: 'primary.main' }} />
        </Box>
        <Typography variant="h5" gutterBottom fontWeight={700}>
          Sesión Colaborativa Inicializada
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
          ID de la sesión: <code>{sessionId}</code>. El entorno está listo para conectar los componentes de editor Monaco y WebSocket de presencia.
        </Typography>
      </Paper>
    </Box>
  );
};

export default WorkspacePage;
