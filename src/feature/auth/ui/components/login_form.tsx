import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { loginSchema, type LoginFormInputs } from './login_schema';
import { login } from '../../service/auth_service';
import { useAuth } from '../../hook/use_auth';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { loginSuccess, loading: initializing } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setError(null);
    try {
      const session = await login(data);
      loginSuccess(session.user, session.accessToken);
      navigate('/dashboard', { replace: true });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'No fue posible iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || initializing;

  return (
    <Box className="auth-form">
      <Box className="auth-mobile-brand">
        <Box className="auth-brand-mark"><LockOutlinedIcon /></Box>
        <Typography variant="h6" fontWeight={750}>Nexo</Typography>
      </Box>
      <Typography className="auth-eyebrow">QUÉ BUENO TENERTE DE VUELTA</Typography>
      <Typography component="h2" className="auth-form-title">Inicia sesión</Typography>
      <Typography className="auth-form-description">
        Ingresa tus datos para continuar con tus proyectos.
      </Typography>

      {error && <Alert severity="error" role="alert" sx={{ mb: 2.5 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register('email')}
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          fullWidth
          autoFocus
          disabled={disabled}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          sx={{ mb: 2.2 }}
        />
        <TextField
          {...register('password')}
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          fullWidth
          disabled={disabled}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowPassword((visible) => !visible)}
                  edge="end"
                  disabled={disabled}
                >
                  {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box className="auth-inline-link">
          <Link component={RouterLink} to="/forgot-password" underline="hover">
            ¿Olvidaste tu contraseña?
          </Link>
        </Box>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          className="auth-submit"
          disabled={disabled}
        >
          {loading ? 'Validando acceso…' : 'Entrar a mi espacio'}
        </Button>
      </Box>

      <Typography className="auth-switch">
        ¿Aún no tienes cuenta?{' '}
        <Link component={RouterLink} to="/register" underline="hover" fontWeight={700}>
          Crear una cuenta
        </Link>
      </Typography>
      <Typography className="auth-security-note">
        <LockOutlinedIcon fontSize="inherit" /> Tu conexión está protegida
      </Typography>
    </Box>
  );
};

export default LoginForm;
