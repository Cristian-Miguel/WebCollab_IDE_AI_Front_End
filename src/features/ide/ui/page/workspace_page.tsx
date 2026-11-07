import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Chip, Card, CardContent, Divider } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { WorkspaceContainer } from '../components/workspace_container';
import { JoinSessionButton } from '../components/join_session_button';
import { CreateSessionModal } from '../../../dashboard/ui/components/create_session_modal';

export const WorkspacePage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <Box sx={{ p: { xs: 1, md: 2 }, maxWidth: 1280, width: '100%', mx: 'auto', flexGrow: 1 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate('/dashboard')}
            variant="outlined"
            size="small"
          >
            Volver al Dashboard
          </Button>
          <Typography variant="h5" fontWeight={750}>
            Espacio de Trabajo Colaborativo
          </Typography>
        </Box>
        {sessionId && (
          <Chip
            icon={<GroupsRoundedIcon />}
            label={`Sesión: ${sessionId}`}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      {sessionId ? (
        <WorkspaceContainer sessionId={sessionId} />
      ) : (
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            p: { xs: 2, md: 4 },
            textAlign: 'center',
            maxWidth: 680,
            mx: 'auto',
            mt: 4,
          }}
        >
          <CardContent>
            <GroupsRoundedIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={750} gutterBottom>
              Unirse a una Sesión Colaborativa
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Ingresa el identificador (UUID) de una sesión activa para conectarte al editor en tiempo real junto con tu equipo (máximo 4 usuarios simultáneos).
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <JoinSessionButton showInput />
            </Box>

            <Divider sx={{ my: 3 }}>¿No tienes un ID de sesión?</Divider>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddBoxRoundedIcon />}
              onClick={() => setIsCreateModalOpen(true)}
              sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}
            >
              Crear Nueva Sesión Colaborativa
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateSessionModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Box>
  );
};

export default WorkspacePage;
