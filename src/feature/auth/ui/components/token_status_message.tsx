import React from 'react';
import { Box, Typography, Alert, AlertTitle, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

interface TokenStatusMessageProps {
    status: 'expired' | 'invalid_format';
}

const TokenStatusMessage: React.FC<TokenStatusMessageProps> = ({ status }) => {
    const navigate = useNavigate();

    const title = status === 'expired' ? 'Enlace Expirado' : 'Enlace Inválido o Corrupto';
    const message = status === 'expired'
        ? 'El enlace de restablecimiento de contraseña ha caducado. Por favor, solicita uno nuevo, ya que solo son válidos por 15 minutos.'
        : 'La URL no contiene un token válido. Verifica si copiaste el enlace completo o solicita uno nuevo.';
    
    const IconComponent = status === 'expired' ? AccessTimeFilledIcon : ReportProblemIcon;
    const severity = status === 'expired' ? 'warning' : 'error';

    return (
        <Box sx={{ maxWidth: 450, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
            
            <IconComponent sx={{ fontSize: 60, color: (theme) => theme.palette[severity].main, mb: 2 }} />

            <Alert severity={severity} sx={{ mb: 3 }}>
                <AlertTitle>{title}</AlertTitle>
                {message}
            </Alert>
            
            <Typography variant="body2" sx={{ mb: 2 }}>
                Haz clic abajo para solicitar un nuevo enlace.
            </Typography>

            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => navigate('/forgot-password')}
            >
                Solicitar Nuevo Enlace
            </Button>
        </Box>
    );
};

export default TokenStatusMessage;