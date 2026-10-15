import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Grid, Card, CardContent, CardActions } from '@mui/material';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import { CreateSessionModal } from '../components/create_session_modal';
import { useAuth } from '../../../auth/hook/use_auth';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={750} gutterBottom>
            Panel de Control
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenido, {user?.email || 'Desarrollador'}. Crea y gestiona tus sesiones colaborativas de código.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddBoxRoundedIcon />}
          onClick={() => setIsModalOpen(true)}
          sx={{ borderRadius: 2, px: 3, py: 1.2, fontWeight: 600, textTransform: 'none' }}
        >
          Nueva Sesión Colaborativa
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: 'primary.light', color: 'primary.main', borderRadius: 2, display: 'flex' }}>
              <CodeRoundedIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Editor en Vivo</Typography>
              <Typography variant="h6" fontWeight={700}>HTML, CSS & JS</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: 'secondary.light', color: 'secondary.main', borderRadius: 2, display: 'flex' }}>
              <GroupsRoundedIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Capacidad de Sala</Typography>
              <Typography variant="h6" fontWeight={700}>Hasta 4 Usuarios</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: 'success.light', color: 'success.main', borderRadius: 2, display: 'flex' }}>
              <AddBoxRoundedIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Sincronización</Typography>
              <Typography variant="h6" fontWeight={700}>Tiempo Real (CRDT)</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Card elevation={2} sx={{ borderRadius: 3, p: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
        <CardContent sx={{ py: 6 }}>
          <GroupsRoundedIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Comienza una nueva colaboración
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
            Crea una sesión de programación colaborativa, comparte el enlace con hasta 3 desarrolladores y edita proyectos en tiempo real.
          </Typography>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="medium"
              startIcon={<AddBoxRoundedIcon />}
              onClick={() => setIsModalOpen(true)}
              sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}
            >
              Crear Primera Sesión
            </Button>
          </CardActions>
        </CardContent>
      </Card>

      <CreateSessionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};

export default DashboardPage;
