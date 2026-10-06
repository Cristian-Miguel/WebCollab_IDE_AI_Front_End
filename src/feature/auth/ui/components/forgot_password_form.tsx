import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { requestPasswordReset } from '../../service/auth_service';
import { useAuth } from '../../hook/use_auth';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';

// Esquema simple para el correo
const forgotPasswordSchema = z.object({
  email: z.string().email('Ingrese un correo válido.'),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
  const { loading, setLoading, setError } = useAuth();
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await requestPasswordReset(data.email);

    if (result) {
      setSuccess(true);
    } else {
      // Mensaje genérico para no revelar si el correo existe
      setError('Si el correo existe, recibirás un enlace para restablecer tu contraseña.');
    }
    
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        ¿Olvidaste tu contraseña?
      </Typography>
      <Typography variant="body2" align="center" sx={{ mb: 3 }}>
        Ingresa tu correo y te enviaremos un enlace para restablecerla.
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>Enlace enviado. ¡Revisa tu bandeja de entrada!</Alert>}
      {loading && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {errors.root?.message && <Alert severity="error" sx={{ mb: 2 }}>{errors.root.message}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Correo Electrónico"
          fullWidth
          margin="normal"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={loading || success}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading || success}
        >
          Enviar Enlace
        </Button>
      </form>
    </Box>
  );
};

export default ForgotPasswordForm;
