import React, { useState } from 'react';
import { 
    Box, Typography, Divider, Paper, Grid, Button, Alert, AlertTitle, CircularProgress, Avatar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Servicios y Hooks
import { useAuth } from '../../../auth/hook/use_auth';
import { resendValidationEmail } from '../../../auth/service/auth_service'; 
import { useUser } from '../../hook/use_user'; 
import { type User } from '../../model/user_model'; 

const SettingsPage: React.FC = () => {
    const { user: fullUser, isLoading: dataLoading, error: dataError} = useUser();
    const { logout } = useAuth(); 
    
    const [sendLoading, setSendLoading] = useState(false);
    const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');

    if (dataLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5, mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!fullUser) {
         return <Box sx={{ p: 5 }}>No se encontró información del usuario.</Box>;
    }

    const user = fullUser as User;
    const isVerified = Boolean(user.isEmailVerified);
    
    const handleResendEmail = async () => {
        setSendLoading(true);
        setSendStatus('idle');
        try {
            await resendValidationEmail();
            setSendStatus('success');
        } catch {
            setSendStatus('error');
        } finally {
            setSendLoading(false);
        }
    };

    const handleLogout = () => {
        logout(); 
    };
    
    const handleActionClick = (action: string) => {
        console.log(`${action} click.`);
    };

    const handleFotoOrIconProfile = () => {
        if (user.profileImageUrl) {
            return (
                <Avatar 
                    alt={user.fullName || 'Usuario'}
                    src={user.profileImageUrl}
                    sx={{ width: 80, height: 80 }} 
                />
            );
        } else {
            return (
                <AccountCircleIcon sx={{ width: 80, height: 80, color: 'primary.main' }} />
            );
        }
    };
    
    const ProfileCard = () => (
        <Paper 
            elevation={2} 
            sx={{ 
                p: 3, 
                mb: 4, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 3, 
                borderRadius: 3 
            }}
        >   
            {handleFotoOrIconProfile()}
            <Box>
                <Typography variant="h5" fontWeight={700} component="div">
                    {user.fullName || 'Nombre Completo No Definido'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {user.email}
                </Typography>
                {isVerified && (
                     <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                         <CheckCircleIcon sx={{ fontSize: 14, mr: 0.5 }} /> Correo Verificado
                     </Typography>
                )}
            </Box>
        </Paper>
    );

    const VerificationWarning = () => {
        if (isVerified) return null;

        return (
            <Paper 
                elevation={1} 
                sx={{ 
                    p: 2.5, 
                    mb: 4, 
                    borderRadius: 3,
                    border: '1px solid', 
                    borderColor: 'warning.main', 
                    backgroundColor: 'warning.light' + '10' 
                }}
            >
                <Typography variant="h6" color="warning.dark" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <WarningIcon sx={{ mr: 1 }} />
                    Verificación de Correo Pendiente
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Tu cuenta <strong>{user.email}</strong> aún no ha sido verificada. Por favor, solicita un nuevo enlace si no lo has recibido.
                </Typography>
                
                {sendStatus === 'success' && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Hemos enviado un nuevo enlace de verificación.
                    </Alert>
                )}
                {sendStatus === 'error' && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Error al intentar reenviar el enlace. Por favor, intenta de nuevo más tarde.
                    </Alert>
                )}
                
                <Button
                    variant="contained"
                    color="warning"
                    onClick={handleResendEmail}
                    disabled={sendLoading}
                    startIcon={sendLoading && <CircularProgress size={20} color="inherit" />}
                >
                    {sendLoading ? 'Enviando...' : 'Reenviar Enlace de Validación'}
                </Button>
            </Paper>
        );
    };

    return (
        <Box sx={{ p: { xs: 1, md: 2 }, maxWidth: 960, width: '100%', mx: 'auto', flexGrow: 1 }}>
            <Typography variant="h4" fontWeight={750} component="h1" gutterBottom>
                Configuración de Perfil
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <ProfileCard />
            <VerificationWarning />

            <Typography variant="h5" fontWeight={700} component="h2" gutterBottom sx={{ mt: 4 }}>
                Acciones de Cuenta
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        fullWidth
                        size="large"
                        onClick={() => handleActionClick('Modificar Información')}
                    >
                        Modificar Información
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<LockIcon />}
                        fullWidth
                        size="large"
                        onClick={() => handleActionClick('Cambiar Contraseña')}
                    >
                        Cambiar Contraseña
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteForeverIcon />}
                        fullWidth
                        size="large"
                        onClick={() => handleActionClick('Eliminar Cuenta')}
                    >
                        Eliminar Cuenta
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<LogoutIcon />}
                        fullWidth
                        size="large"
                        onClick={handleLogout}
                    >
                        Cerrar Sesión
                    </Button>
                </Grid>
            </Grid>
            
            {dataError && (
                 <Alert severity="error" sx={{ mt: 4 }}>
                    <AlertTitle>Error de Carga de Perfil</AlertTitle>
                    {dataError}
                 </Alert>
            )}
        </Box>
    );
};

export default SettingsPage;
