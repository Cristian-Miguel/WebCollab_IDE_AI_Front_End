import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, Link, Typography } from '@mui/material';
import { validateEmail } from '../../service/auth_service';
import { validateEmailToken } from '../../../../core/config/jwt_manage';
import { useAuth } from '../../hook/use_auth';

const ValidatedEmailPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired' | 'invalid'>('loading');
  const [message, setMessage] = useState('');
  const tokenStatus = token ? validateEmailToken(token) : 'invalid_format';

  useEffect(() => {
    let active = true;

    if (tokenStatus === 'invalid_format') {
      setStatus('invalid');
      setMessage('El enlace no tiene un formato válido. Comprueba que copiaste la dirección completa.');
      return () => { active = false; };
    }
    if (tokenStatus === 'expired') {
      setStatus('expired');
      setMessage('El enlace de verificación ha caducado. Inicia sesión para solicitar uno nuevo.');
      return () => { active = false; };
    }

    if (!token) return () => { active = false; };

    setStatus('loading');
    void validateEmail(token)
      .then(() => {
        if (active) {
          setStatus('success');
          setMessage('Tu correo está verificado. Ya puedes continuar con tus proyectos.');
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setStatus('error');
          setMessage(error instanceof Error ? error.message : 'No fue posible verificar el correo.');
        }
      });

    return () => { active = false; };
  }, [token, tokenStatus]);

  return (
    <Box className="auth-form auth-form-compact auth-status-page">
      <Typography className="auth-eyebrow">VERIFICACIÓN DE CUENTA</Typography>
      <Typography component="h2" className="auth-form-title">
        {status === 'success' ? 'Correo confirmado' : 'Confirma tu correo'}
      </Typography>
      {status === 'loading' ? (
        <Box className="auth-verification-loading">
          <CircularProgress size={28} aria-label="Verificando correo" />
          <Typography className="auth-form-description">Estamos comprobando el enlace con el servidor…</Typography>
        </Box>
      ) : (
        <>
          <Alert severity={status === 'success' ? 'success' : status === 'expired' ? 'warning' : 'error'} role="status">
            {message}
          </Alert>
          <Button
            variant="contained"
            fullWidth
            size="large"
            className="auth-submit"
            onClick={() => navigate(isAuthenticated && status === 'success' ? '/dashboard' : '/login', { replace: true })}
          >
            {isAuthenticated && status === 'success' ? 'Ir a mis proyectos' : 'Ir al inicio de sesión'}
          </Button>
          {!isAuthenticated && (status === 'expired' || status === 'error') && (
            <Typography className="auth-switch">
              ¿Necesitas otro enlace?{' '}
              <Link component={RouterLink} to="/login" underline="hover" fontWeight={700}>Inicia sesión</Link>
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default ValidatedEmailPage;
