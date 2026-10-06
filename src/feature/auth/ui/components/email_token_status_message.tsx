// import React from 'react';
// import { Box, Typography, Alert, AlertTitle, Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import ReportProblemIcon from '@mui/icons-material/ReportProblem';
// import MailOutlineIcon from '@mui/icons-material/MailOutline';

// interface EmailTokenStatusMessageProps {
//     status: 'expired' | 'invalid_format';
// }

// const EmailTokenStatusMessage: React.FC<EmailTokenStatusMessageProps> = ({ status }) => {
//     const navigate = useNavigate();

//     const title = status === 'expired' ? 'Enlace de Activación Expirado' : 'Enlace Inválido';
//     const message = status === 'expired'
//         ? 'El enlace de validación de correo ha caducado (válido por 15 días). Necesitarás registrarte nuevamente.'
//         : 'El enlace no es válido. Por favor, verifica que copiaste el enlace completo o intenta registrarte de nuevo.';
    
//     const IconComponent = status === 'expired' ? MailOutlineIcon : ReportProblemIcon;
//     const severity = status === 'expired' ? 'warning' : 'error';

//     return (
//         <Box sx={{ maxWidth: 450, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
            
//             <IconComponent sx={{ fontSize: 60, color: (theme) => theme.palette[severity].main, mb: 2 }} />

//             <Alert severity={severity} sx={{ mb: 3 }}>
//                 <AlertTitle>{title}</AlertTitle>
//                 {message}
//             </Alert>
            
//             <Typography variant="body2" sx={{ mb: 2 }}>
//                 Puedes registrarte nuevamente para obtener un nuevo enlace.
//             </Typography>

//             <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 size="large"
//                 onClick={() => navigate('/register')}
//             >
//                 Ir a la Página de Registro
//             </Button>
//         </Box>
//     );
// };

// export default EmailTokenStatusMessage;

// src/feature/auth/ui/components/EmailTokenStatusMessage.tsx

import React from 'react';
import { Box, Typography, Alert, AlertTitle, Button } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

interface EmailTokenStatusMessageProps {
    status: 'expired' | 'invalid_format';
    isAuthenticated: boolean; // <-- Nuevo prop para saber el estado
    navigate: (path: string) => void; // Prop para manejar la navegación
}

const EmailTokenStatusMessage: React.FC<EmailTokenStatusMessageProps> = ({ status, isAuthenticated, navigate }) => {
    
    // Contenido basado en el estado del token
    const title = status === 'expired' ? 'Enlace de Activación Expirado' : 'Enlace Inválido o Corrupto';
    const IconComponent = status === 'expired' ? MailOutlineIcon : ReportProblemIcon;
    const severity = status === 'expired' ? 'warning' : 'error';
    
    // Mensajes y Acción basados en la autenticación
    let message = '';
    let buttonText = '';
    let targetPath = '';

    if (isAuthenticated) {
        // LOGUEADO: Ir a la configuración para solicitar nuevo enlace
        message = status === 'expired'
            ? 'El enlace de validación ha caducado. Por favor, **ve a Configuración** para solicitar uno nuevo.'
            : 'El enlace no es válido. Por favor, **ve a Configuración** para revisar el estado de tu correo.';
        buttonText = 'Ir a Configuración';
        targetPath = '/settings'; // Ruta placeholder
    } else {
        // NO LOGUEADO: Ir al login
        message = status === 'expired'
            ? 'El enlace de validación ha caducado. Por favor, **inicia sesión** para solicitar un nuevo enlace desde la configuración.'
            : 'El enlace no es válido. Por favor, **inicia sesión** para acceder a tu cuenta.';
        buttonText = 'Ir a Iniciar Sesión';
        targetPath = '/login';
    }

    return (
        <Box sx={{ maxWidth: 450, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
            
            <IconComponent sx={{ fontSize: 60, color: (theme) => theme.palette[severity].main, mb: 2 }} />

            <Alert severity={severity} sx={{ mb: 3 }}>
                <AlertTitle>{title}</AlertTitle>
                <Typography variant="body1" component="span" sx={{ whiteSpace: 'pre-line' }}>
                    {message}
                </Typography>
            </Alert>
            
            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => navigate(targetPath)}
            >
                {buttonText}
            </Button>
        </Box>
    );
};

export default EmailTokenStatusMessage;