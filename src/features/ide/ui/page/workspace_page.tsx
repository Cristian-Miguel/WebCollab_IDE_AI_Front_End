import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Chip } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import { WorkspaceContainer } from '../components/workspace_container';

export const WorkspacePage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
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

      {sessionId && <WorkspaceContainer sessionId={sessionId} />}
    </Box>
  );
};

export default WorkspacePage;
