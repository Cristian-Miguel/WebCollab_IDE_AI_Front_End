import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../auth/hook/use_auth';
import {
  Alert,
  Grid,
  Typography,
  Paper,
  Box,
  Divider,
  Snackbar,
  Button,
  Chip,
} from '@mui/material';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CreateSessionModal } from '../../../dashboard/ui/components/create_session_modal';
import { JoinSessionButton } from '../../../ide/ui/components/join_session_button';
import { ChartBar } from '../components/chart_bar';
import { ChartPie } from '../components/chart_pie';

const HomePage: React.FC = () => {
  const { user, userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [registrationNotice, setRegistrationNotice] = useState<string | null>(
    (location.state as { notice?: string } | null)?.notice || null,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (registrationNotice) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, navigate, registrationNotice]);

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setIsCreateModalOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <Box sx={{ p: { xs: 1, md: 2 }, maxWidth: 1280, width: '100%', mx: 'auto', flexGrow: 1 }}>
      <Snackbar
        open={Boolean(registrationNotice)}
        autoHideDuration={9000}
        onClose={() => setRegistrationNotice(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setRegistrationNotice(null)} sx={{ width: '100%' }}>
          {registrationNotice}
        </Alert>
      </Snackbar>

      {/* 1. Encabezado de Bienvenida y Acción Principal */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={750}
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <WavingHandIcon sx={{ color: 'primary.main' }} />
            {getGreeting()}, {user?.email || 'Desarrollador'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body1" color="text.secondary">
              Panel de Control y Analítica de Sesiones Colaborativas
            </Typography>
            <Chip
              size="small"
              color="primary"
              variant="outlined"
              label={`Rol: ${userRole ? userRole.toUpperCase() : 'CUSTOMER'}`}
            />
          </Box>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddBoxRoundedIcon />}
          onClick={() => setIsCreateModalOpen(true)}
          sx={{ borderRadius: 2, px: 3, py: 1.2, fontWeight: 600, textTransform: 'none' }}
        >
          Nueva Sesión Colaborativa
        </Button>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <CreateSessionModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* 2. Tarjetas de Métricas Clave (KPIs alineados) */}
      <Grid container spacing={3} sx={{ mb: 4 }} alignItems="stretch">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                Total de Usuarios Activos
              </Typography>
              <GroupsRoundedIcon color="primary" />
            </Box>
            <Typography variant="h3" fontWeight={800} color="primary.main" sx={{ my: 1 }}>
              1,250
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2" color="success.main" fontWeight={600}>
                +10% esta semana
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                Sesiones Colaborativas (CRDT)
              </Typography>
              <CodeRoundedIcon color="secondary" />
            </Box>
            <Typography variant="h3" fontWeight={800} color="secondary.main" sx={{ my: 1 }}>
              187
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2" color="success.main" fontWeight={600}>
                Hasta 4 usuarios por sala
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
                Acceso Rápido a Sala (Workspace)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Únete inmediatamente con el ID de una sesión activa:
              </Typography>
            </Box>
            <JoinSessionButton showInput />
          </Paper>
        </Grid>
      </Grid>

      {/* 3. Sección de Gráficas Renderizadas y Alineadas */}
      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <ChartBar />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <ChartPie />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
