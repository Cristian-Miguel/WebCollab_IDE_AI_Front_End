import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { resetPassword } from '../../service/auth_service';
import { useAuth } from '../../hook/use_auth';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, CircularProgress, Alert, Link as MuiLink } from '@mui/material';
import type { ErrorResponse } from '../../../../core/model/error_response';

// Esquema de validación para la nueva contraseña (misma lógica que en Registro) [cite: 111]
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/;

const resetPasswordSchema = z.object({
    password: z.string()
      .min(8, 'Debe tener entre 8 y 16 caracteres.')
      .max(16, 'Debe tener entre 8 y 16 caracteres.')
      .regex(PASSWORD_REGEX, 'Debe incluir mayúscula, minúscula, número y carácter especial.'),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
});

type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordChangeFormProps {
    token: string; // Recibe el token de la URL
}

const ResetPasswordChangeForm: React.FC<ResetPasswordChangeFormProps> = ({ token }) => {
    const { loading, setLoading, setError, error: authError } = useAuth();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormInputs>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormInputs) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const resetData = { ...data, token };

        const result = await resetPassword(resetData);

        if (result.code[0] === 'S') {
            setSuccess(true);
            setTimeout(() => navigate('/login'), 5000);
        } else {
            const errorObject = result as ErrorResponse;

            if(errorObject.code === 'E0001') {
                setError('Error al restablecer la contraseña. Inténtalo de nuevo.');
                setLoading(false);
                return;
            } else if(errorObject.code === 'E1004') {
                setError('Error: El token para validar el cambio de contraseña expiró o no es válido. Solicita uno nuevo.');
                setLoading(false);
                return;
            } else {
                setError(errorObject.message || 'Error desconocido al restablecer la contraseña. Inténtalo de nuevo.');
            }
        }
        
        setLoading(false);
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom align="center">
                Establecer Nueva Contraseña
            </Typography>
            {success && 
                <Alert severity="success" sx={{ mb: 2 }}>
                    Contraseña restablecida con éxito. Serás redirigido al inicio de sesión.
                </Alert>
            }
            {loading && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 2 }} />}
            {/* {errors.root?.message && <Alert severity="error" sx={{ mb: 2 }}>{errors.root.message}</Alert>} */}
            {authError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {authError}
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                    label="Nueva Contraseña"
                    fullWidth
                    margin="normal"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    disabled={loading || success}
                    type="password"
                />
                <TextField
                    label="Confirmar Contraseña"
                    fullWidth
                    margin="normal"
                    {...register('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    disabled={loading || success}
                    type="password"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    disabled={loading || success}
                >
                    Cambiar Contraseña
                </Button>
            </form>

            {!success && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <MuiLink href="/forgot-password" variant="body2">
                        ¿Solicitar un nuevo enlace?
                    </MuiLink>
                </Box>
            )}
        </Box>
    );
};

export default ResetPasswordChangeForm;