import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink } from 'react-router-dom';
import { z } from 'zod';
import { Alert, Box, Button, Link, TextField, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { requestPasswordReset } from '../../service/auth_service';

const schema = z.object({
  email: z.string().trim().email('Escribe un correo electrónico válido.'),
});

type ForgotPasswordFormInputs = z.infer<typeof schema>;

const ForgotPasswordForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async ({ email }: ForgotPasswordFormInputs) => {
    setLoading(true);
    setError(null);
    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'No fue posible procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="auth-form auth-form-compact">
      <Typography className="auth-eyebrow">RECUPERACIÓN DE CUENTA</Typography>
      <Typography component="h2" className="auth-form-title">¿Olvidaste tu contraseña?</Typography>
      <Typography className="auth-form-description">
        Escribe el correo asociado a tu cuenta. Si existe, te enviaremos un enlace para crear una nueva contraseña.
      </Typography>

      {submitted && (
        <Alert severity="success" role="status" sx={{ mb: 2.5 }}>
          Si el correo está registrado, recibirás las instrucciones en tu bandeja de entrada.
        </Alert>
      )}
      {error && <Alert severity="error" role="alert" sx={{ mb: 2.5 }}>{error}</Alert>}

      {!submitted && (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register('email')}
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            fullWidth
            autoFocus
            disabled={loading}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
          <Button type="submit" variant="contained" fullWidth size="large" className="auth-submit" disabled={loading}>
            {loading ? 'Enviando…' : 'Enviar instrucciones'}
          </Button>
        </Box>
      )}

      <Link component={RouterLink} to="/login" className="auth-back-link" underline="hover">
        <ArrowBackRoundedIcon fontSize="small" /> Volver al inicio de sesión
      </Link>
    </Box>
  );
};

export default ForgotPasswordForm;
