import React from 'react';
import { useAuth } from '../../../auth/hook/use_auth';
import { Alert, Grid, Typography, Paper, Box, Divider, Snackbar, Button } from '@mui/material';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CreateSessionModal } from '../../../dashboard/ui/components/create_session_modal';

// Componentes futuros que podrían ir aquí
// import ChartPie from '../components/chart_pie'; 
// import ChartBar from '../components/char_bar'; 

const HomePage: React.FC = () => {
    // Obtenemos los datos del usuario para personalizar la bienvenida
    const { user, userRole } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [registrationNotice, setRegistrationNotice] = useState<string | null>(
        (location.state as { notice?: string } | null)?.notice || null,
    );
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        if (registrationNotice) {
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location.pathname, navigate, registrationNotice]);
    
    // Función para obtener la hora del día y un saludo apropiado
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos Días';
        if (hour < 18) return 'Buenas Tardes';
        return 'Buenas Noches';
    };

    return (
        <Box sx={{ p: 2, flexGrow: 1 }}>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <WavingHandIcon sx={{ mr: 1, color: 'primary.main' }} />
                        {getGreeting()}, {user?.email || 'Usuario'}
                    </Typography>
                    
                    <Typography variant="h6" color="text.secondary">
                        Rol Actual: **{userRole ? userRole.toUpperCase() : 'N/A'}**
                    </Typography>
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

            {/* 2. Sección de Widgets y Métricas (Contenedor para futuras adiciones) */}
            <Grid container spacing={3}>
                
                {/* Widget de Ejemplo 1: Métrica simple */}
                <Grid>
                    <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant="subtitle1" color="text.secondary">Total de Usuarios</Typography>
                        <Typography variant="h3" color="primary.main">1,250</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="success.main">+10% esta semana</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Widget de Ejemplo 2: Placeholder para futura gráfica */}
                <Grid>
                    <Paper elevation={3} sx={{ p: 3, minHeight: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="text.disabled">
                                Contenedor Principal (Gráfica de Barras)
                            </Typography>
                            <Typography variant="body2" color="text.disabled">
                                Aquí se renderizará el componente `chart_bar.tsx` con datos reales.
                            </Typography>
                        </Box>
                        {/* <ChartBar /> */}
                    </Paper>
                </Grid>

                {/* Widget de Ejemplo 3: Placeholder para otra gráfica */}
                <Grid>
                     <Paper elevation={3} sx={{ p: 3, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="text.disabled">
                                Gráfica Secundaria (Pie Chart)
                            </Typography>
                            <Typography variant="body2" color="text.disabled">
                                Aquí se renderizará el componente `chart_pie.tsx`.
                            </Typography>
                        </Box>
                        {/* <ChartPie /> */}
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
};

export default HomePage;