import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { registerSchema, type RegisterFormInputs } from './register_schema';
import { registerUser } from '../../service/auth_service';
import { useAuth } from '../../hook/use_auth';
import type { RegisterInputs } from '../../model/auth_model';

const RegisterForm: React.FC = () => {
  const { loginSuccess, loading: initializing } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      birthDate: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    setError(null);
    try {
      const payload: RegisterInputs = {
        fullName: data.fullName,
        email: data.email,
        birthDate: new Date(`${data.birthDate}T00:00:00.000Z`).toISOString(),
        password: data.password,
        role: { name: 'CUSTOMER' },
      };
      const session = await registerUser(payload);
      loginSuccess(session.user, session.accessToken);
      navigate('/dashboard', {
        replace: true,
        state: { notice: 'Tu cuenta está lista. Revisa tu correo para confirmar la dirección y mantenerla protegida.' },
      });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'No fue posible crear tu cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || initializing;
  const passwordAdornment = (visible: boolean, toggle: () => void, label: string) => (
    <InputAdornment position="end">
      <IconButton aria-label={label} onClick={toggle} edge="end" disabled={disabled}>
        {visible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Box className="auth-form auth-form-register">
      <Box className="auth-mobile-brand">
        <Box className="auth-brand-mark"><LockOutlinedIcon /></Box>
        <Typography variant="h6" fontWeight={750}>Nexo</Typography>
      </Box>
      <Typography className="auth-eyebrow">EMPIEZA ALGO NUEVO</Typography>
      <Typography component="h2" className="auth-form-title">Crea tu cuenta</Typography>
      <Typography className="auth-form-description">
        Unos datos y estarás listo para construir en equipo.
      </Typography>

      {error && <Alert severity="error" role="alert" sx={{ mb: 2.5 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={1.8}>
          <Grid size={{ xs: 12 }}>
            <TextField
              {...register('fullName')}
              label="Nombre completo"
              autoComplete="name"
              fullWidth
              disabled={disabled}
              error={Boolean(errors.fullName)}
              helperText={errors.fullName?.message}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              {...register('email')}
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              fullWidth
              disabled={disabled}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register('birthDate')}
              label="Fecha de nacimiento"
              type="date"
              autoComplete="bday"
              fullWidth
              disabled={disabled}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: new Date().toISOString().slice(0, 10) } }}
              error={Boolean(errors.birthDate)}
              helperText={errors.birthDate?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register('password')}
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              fullWidth
              disabled={disabled}
              InputProps={{ endAdornment: passwordAdornment(showPassword, () => setShowPassword((value) => !value), showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña') }}
              error={Boolean(errors.password)}
              helperText={errors.password?.message || '8–16 caracteres; incluye mayúscula, número y símbolo.'}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register('confirmPassword')}
              label="Confirma contraseña"
              type={showConfirmation ? 'text' : 'password'}
              autoComplete="new-password"
              fullWidth
              disabled={disabled}
              InputProps={{ endAdornment: passwordAdornment(showConfirmation, () => setShowConfirmation((value) => !value), showConfirmation ? 'Ocultar confirmación' : 'Mostrar confirmación') }}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" fullWidth size="large" className="auth-submit" disabled={disabled}>
          {loading ? 'Creando tu cuenta…' : 'Crear cuenta'}
        </Button>
      </Box>

      <Typography className="auth-switch">
        ¿Ya tienes cuenta?{' '}
        <Link component={RouterLink} to="/login" underline="hover" fontWeight={700}>
          Inicia sesión
        </Link>
      </Typography>
    </Box>
  );
};

export default RegisterForm;
