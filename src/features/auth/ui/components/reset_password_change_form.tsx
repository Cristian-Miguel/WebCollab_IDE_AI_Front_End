import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { z } from 'zod';
import { resetPassword } from '../../service/auth_service';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,16}$/;
const resetSchema = z.object({
  password: z.string()
    .min(8, 'Usa entre 8 y 16 caracteres.')
    .max(16, 'Usa entre 8 y 16 caracteres.')
    .regex(PASSWORD_REGEX, 'Incluye mayúscula, minúscula, número y un símbolo.'),
  confirmPassword: z.string(),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
  message: 'Las contraseñas no coinciden.',
  path: ['confirmPassword'],
});

type ResetFormInputs = z.infer<typeof resetSchema>;

const ResetPasswordChangeForm: React.FC<{ token: string }> = ({ token }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormInputs>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async ({ password }: ResetFormInputs) => {
    setLoading(true);
    setError(null);
    try {
      await resetPassword({ password, token });
      setSuccess(true);
      window.setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'No fue posible cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (visible: boolean, toggle: () => void, label: string) => (
    <InputAdornment position="end">
      <IconButton aria-label={label} onClick={toggle} edge="end" disabled={loading || success}>
        {visible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Box className="auth-form auth-form-compact">
      <Typography className="auth-eyebrow">RECUPERACIÓN DE CUENTA</Typography>
      <Typography component="h2" className="auth-form-title">Elige una nueva contraseña</Typography>
      <Typography className="auth-form-description">
        Crea una contraseña segura que no hayas usado antes.
      </Typography>
      {success && (
        <Alert severity="success" role="status" sx={{ mb: 2.5 }}>
          Tu contraseña cambió correctamente. Te llevaremos al inicio de sesión.
        </Alert>
      )}
      {error && <Alert severity="error" role="alert" sx={{ mb: 2.5 }}>{error}</Alert>}

      {!success && (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register('password')}
            label="Nueva contraseña"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            fullWidth
            autoFocus
            disabled={loading}
            InputProps={{ endAdornment: togglePassword(showPassword, () => setShowPassword((visible) => !visible), showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña') }}
            error={Boolean(errors.password)}
            helperText={errors.password?.message || '8–16 caracteres; incluye mayúscula, número y símbolo.'}
            sx={{ mb: 2 }}
          />
          <TextField
            {...register('confirmPassword')}
            label="Confirmar nueva contraseña"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            fullWidth
            disabled={loading}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword?.message}
          />
          <Button type="submit" variant="contained" fullWidth size="large" className="auth-submit" disabled={loading}>
            {loading ? 'Actualizando…' : 'Guardar nueva contraseña'}
          </Button>
        </Box>
      )}
      <Link component={RouterLink} to="/login" className="auth-back-link" underline="hover">
        <ArrowBackRoundedIcon fontSize="small" /> Volver al inicio de sesión
      </Link>
    </Box>
  );
};

export default ResetPasswordChangeForm;
