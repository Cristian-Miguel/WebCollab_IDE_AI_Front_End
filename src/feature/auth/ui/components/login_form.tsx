import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { loginSchema, type LoginFormInputs } from './login_schema';
import { login } from '../../service/auth_service';
import { useAuth } from '../../hook/use_auth';

// Material UI components
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    loading,
    error: authError, 
    loginSuccess, 
    dispatch
  } = useAuth();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Función que maneja el envío del formulario
  const onSubmit = async (data: LoginFormInputs) => {
    // 1. Establecer estado de carga (LOADING)
    dispatch({ type: 'AUTH/LOADING', payload: true });
    dispatch({ type: 'AUTH/ERROR', payload: null }); // Limpiar errores previos

    // 2. Llamar al servicio de login
    const success = await login(data, loginSuccess);

    // 3. Manejo de resultado
    if (success) {
      // El loginSuccess de useAuth ya maneja el estado de autenticación y guarda tokens
      // No hacemos nada más aquí, la navegación es manejada por el ProtectedRoute.
      navigate('/dashboard');
    } else {
      // Si falla, establece un error local para mostrar en la interfaz
      // El servicio ya registra el error en consola, aquí mostramos un mensaje general.
      dispatch({ type: 'AUTH/ERROR', payload: 'Credenciales inválidas o error de conexión.' });
    }
    
    // 4. Detener carga
    dispatch({ type: 'AUTH/LOADING', payload: false });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Iniciar Sesión
      </Typography>

      {/* Mostrar Error de Autenticación */}
      {authError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {authError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Campo de Email */}
        <TextField
          label="Correo Electrónico"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={loading}
          type="email"
        />

        {/* Campo de Contraseña */}
        <TextField
          label="Contraseña"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={loading}
          type="password"
        />

        {/* Botón de Submit */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Acceder'}
        </Button>
      </form>
      
      <Box sx={{ textAlign: 'center' }}>
        <Link href="/forgot-password" variant="body2" sx={{ display: 'block' }}>
          ¿Olvidaste tu contraseña?
        </Link>
        <Link href="/register" variant="body2" sx={{ mt: 1 }}>
          ¿No tienes cuenta? Regístrate
        </Link>
      </Box>
    </Box>
  );
};

export default LoginForm;