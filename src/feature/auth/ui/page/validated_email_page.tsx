// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { validateEmail } from '../../service/auth_service';

// // Material UI components
// import { Box, Typography, CircularProgress, Alert, AlertTitle, Link } from '@mui/material';

// const ValidatedEmailPage: React.FC = () => {
//     // 1. Extraer el token de la URL
//     const { token } = useParams<{ token: string }>();
//     const navigate = useNavigate();
    
//     // Estados para la interfaz de usuario
//     const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
//     const [message, setMessage] = useState('Verificando token de validación...');

//     useEffect(() => {
//         if (!token) {
//             setStatus('error');
//             setMessage('Error: No se encontró el token de validación en la URL.');
//             return;
//         }

//         const handleValidation = async () => {
//             const success = await validateEmail(token);

//             if (success) {
//                 setStatus('success');
//                 setMessage('¡Correo verificado con éxito! Tu cuenta está activa.');
//                 // Redirigir al login después de un breve periodo
//                 setTimeout(() => navigate('/login'), 5000);
//             } else {
//                 setStatus('error');
//                 setMessage('El token de validación ha expirado o es inválido. Por favor, intenta registrarte de nuevo o solicita un nuevo enlace.');
//             }
//         };

//         handleValidation();

//     }, [token, navigate]);

//     // 2. Renderizar la interfaz según el estado
//     return (
//         <Box sx={{ maxWidth: 500, mx: 'auto', p: 3, textAlign: 'center' }}>
//             {status === 'loading' && (
//                 <>
//                     <CircularProgress sx={{ mb: 2 }} />
//                     <Typography variant="h6">{message}</Typography>
//                 </>
//             )}

//             {status === 'success' && (
//                 <Alert severity="success">
//                     <AlertTitle>¡Verificación Exitosa!</AlertTitle>
//                     {message} Serás redirigido al <Link href="/login" underline="always">Inicio de Sesión</Link> en breve.
//                 </Alert>
//             )}

//             {status === 'error' && (
//                 <Alert severity="error">
//                     <AlertTitle>Verificación Fallida</AlertTitle>
//                     {message}
//                     <Box sx={{ mt: 1 }}>
//                         <Link href="/register" underline="always">Ir a la página de Registro</Link>
//                     </Box>
//                 </Alert>
//             )}
//         </Box>
//     );
// };

// export default ValidatedEmailPage;
// src/feature/auth/ui/page/validated_email_page.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../service/auth_service';
import { validateEmailToken } from '../../../../core/config/jwt_manage';
import EmailTokenStatusMessage from '../components/email_token_status_message';
import { useAuth } from '../../hook/use_auth'; // <-- Importar useAuth

// Material UI components
import { Box, Typography, CircularProgress, Alert, AlertTitle, Link, Button } from '@mui/material';

const ValidatedEmailPage: React.FC = () => {
    // 1. Obtener estado de autenticación
    const { isAuthenticated } = useAuth(); 
    
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verificando token de validación...');

    // Determinar la ruta de redirección según el estado de autenticación
    const redirectPath = isAuthenticated ? '/settings' : '/login';

    // 2. Validación Previa (JWT) y Redirección directa si es necesario
    if (!token) {
        // Si no hay token, el enlace está mal formado. Redirigir al usuario al flujo correcto.
        navigate(redirectPath, { replace: true });
        return null; // No renderizar nada mientras se redirige
    }
    
    const tokenStatus = validateEmailToken(token);
    
    if (tokenStatus === 'expired' || tokenStatus === 'invalid_format') {
        // Si el token es inválido/expirado, mostramos el mensaje de error visual
        return (
            <EmailTokenStatusMessage 
                status={tokenStatus} 
                isAuthenticated={isAuthenticated} 
                navigate={navigate} 
            />
        );
    }

    // 3. Lógica para token 'valid'
    useEffect(() => {
        // Solo ejecutar si el token es válido
        if (tokenStatus !== 'valid') return; 

        const handleValidation = async () => {
            setMessage('Validando cuenta con el servidor...');

            const success = await validateEmail(token);

            if (success) {
                setStatus('success');
                setMessage('¡Correo verificado con éxito! Tu cuenta está activa.');
                
                // Redirigir al usuario autenticado a /settings o a /login si no está auth.
                setTimeout(() => navigate(redirectPath), 5000); 

            } else {
                // Error del backend (ej. token ya usado, error en DB)
                setStatus('error');
                setMessage('El token es válido estructuralmente, pero el servidor lo rechazó (puede que ya se haya usado o haya habido un error).');
            }
        };

        handleValidation();
    // Añadimos isAuthenticated a las dependencias para que el effect sepa la ruta de redirección final
    }, [token, navigate, tokenStatus, isAuthenticated, redirectPath]);

    // 4. Renderizar la interfaz (Loading, Success, Error de Backend)
    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', p: 3, textAlign: 'center' }}>
            {status === 'loading' && (
                <>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="h6">{message}</Typography>
                </>
            )}

            {status === 'success' && (
                <Alert severity="success">
                    <AlertTitle>¡Verificación Exitosa!</AlertTitle>
                    {message} Serás redirigido a **{isAuthenticated ? 'Configuración' : 'Inicio de Sesión'}** en breve.
                </Alert>
            )}

            {status === 'error' && (
                <Alert severity="error">
                    <AlertTitle>Verificación Fallida</AlertTitle>
                    {message}
                    <Box sx={{ mt: 1 }}>
                        {/* Redirige según el estado de autenticación */}
                        <Button variant="outlined" onClick={() => navigate(redirectPath)}>
                            {isAuthenticated ? 'Ir a Configuración' : 'Ir a Iniciar Sesión'}
                        </Button>
                    </Box>
                </Alert>
            )}
        </Box>
    );
};

export default ValidatedEmailPage;