import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormInputs } from './register_schema';
import { registerUser } from '../../service/auth_service';
import { useAuth } from '../../hook/use_auth';
import { useNavigate } from 'react-router-dom';

// Material UI components
import { Box, Button, TextField, Typography, CircularProgress, Alert, Grid, Paper, Link } from '@mui/material';
import type { RegisterInputs } from '../../model/auth_model';
import { date } from 'zod';

const RegisterForm: React.FC = () => {
  const { loading, error: authError, setLoading, setError } = useAuth();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors } 
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    setError(null); 
    setSuccessMessage(null);
    
    try {
        // Enviar solo el primer archivo de la lista
        const userDataToSend:RegisterInputs = {
            email            :data.email,
            password         :data.confirmPassword,
            fullName         :data.fullName,
            rfc              :data.rfc,
            curp             :data.curp,
            birthDate: new Date(data.dateOfBirth),
            profileImageUrl: data.profileImage[0],
            address: {
                street         :data.address.street,
                internalNumber :data.address.internalNumber,
                externalNumber :data.address.externalNumber,
                neighborhood   :data.address.colony,
                locality       :data.address.locality,
                municipality   :data.address.municipality,
                state          :data.address.state,
                zipCode        :data.address.postalCode,
                country        :data.address.country,
            },
            role:{
                name: "CUSTOMER"
            }
        };
        
        // El servicio de registro espera un objeto para la dirección
        const success = await registerUser(userDataToSend);

        if (success) {
            setSuccessMessage("¡Registro exitoso! Por favor, revisa tu correo para validar tu cuenta.");
            // Redirigir al login o a una página de éxito después de un breve retraso
            setTimeout(() => navigate('/login'), 3000); 
        } else {
            // El servicio ya ha logueado un error general, aquí mostramos un mensaje.
            setError('Error al procesar el registro. Inténtalo de nuevo.');
        }

    } catch (e: any) {
        setError(e.message || 'Error inesperado durante el registro.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '80%', mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Registro de Usuario
      </Typography>

      {authError && <Alert severity="error" sx={{ mb: 2 }}>{authError}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <Typography variant="h6" gutterBottom>Datos de Acceso</Typography>
            </Grid>
            <Grid size={0.5}></Grid>

            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <TextField
                label="Correo Electrónico"
                sx={{ width: '100%' }}
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                type="email"
              />
            </Grid>
            <Grid size={0.5}></Grid>

            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <TextField
                label="Contraseña"
                sx={{ width: '100%' }}
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message || 'Min. 8, Max. 16, Mayús, Minús, Número, Símbolo.'}
                type="password"
              />
            </Grid>
            <Grid size={0.5}></Grid>

            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <TextField
                label="Confirmar Contraseña"
                sx={{ width: '100%' }}
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                type="password"
              />
            </Grid>
            <Grid size={0.5}></Grid>

          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <Typography variant="h6" gutterBottom>Datos Personales</Typography>
            </Grid>
            <Grid size={0.5}></Grid>

            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <TextField
                label="Nombre Completo"
                sx={{ width: '100%' }}
                {...register('fullName')}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
              />
            </Grid>
            <Grid size={0.5}></Grid>

            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <TextField
                label="RFC"
                sx={{ width: '100%' }}
                {...register('rfc')}
                error={!!errors.rfc}
                helperText={errors.rfc?.message}
              />
            </Grid>
            <Grid size={0.5}></Grid>

            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <TextField
                label="CURP"
                sx={{ width: '100%' }}
                {...register('curp')}
                error={!!errors.curp}
                helperText={errors.curp?.message}
              />
            </Grid>
            <Grid size={0.5}></Grid>

            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <TextField
                label="Fecha de Nacimiento"
                sx={{ width: '100%' }}
                InputLabelProps={{ shrink: true }}
                {...register('dateOfBirth')}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth?.message}
                type="date"
              />
            </Grid>
            <Grid size={0.5}></Grid>

            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <Controller
                name="profileImage"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                    <TextField
                        label="Imagen de Perfil"
                        type="file"
                        sx={{ width: '100%' }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ accept: 'image/*' }}
                        error={!!errors.profileImage}
                        helperText={errors.profileImage?.message as string}
                        onChange={(e: any) => onChange(e.target.files)}
                        {...field}
                    />
                )}
              />
            </Grid>
            <Grid size={0.5}></Grid>

          </Grid>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <Typography variant="h6" gutterBottom>Dirección</Typography>
            </Grid>
            <Grid size={0.5}></Grid>
            
            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <TextField 
                label="Calle" 
                sx={{ width: '100%' }} 
                {...register('address.street')} 
                error={!!errors.address?.street} 
                helperText={errors.address?.street?.message} />
            </Grid>
            <Grid size={0.5}></Grid>

            <Grid size={0.5}></Grid>
            <Grid size={11} container spacing={2}>
              <Grid size={6}>
                <TextField
                  label="Núm. Externo" 
                  sx={{ width: '100%' }} 
                  {...register('address.externalNumber')} 
                  error={!!errors.address?.externalNumber} 
                  helperText={errors.address?.externalNumber?.message} />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Núm. Interno (Opcional)"
                  sx={{ width: '100%'}}
                  {...register('address.internalNumber')} 
                  error={!!errors.address?.internalNumber} 
                  helperText={errors.address?.internalNumber?.message} />
              </Grid>
            </Grid>
            <Grid size={0.5}></Grid>
            
            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <TextField 
                label="Colonia" 
                sx={{ width: '100%' }} 
                {...register('address.colony')} 
                error={!!errors.address?.colony} 
                helperText={errors.address?.colony?.message} />
            </Grid>
            <Grid size={0.5}></Grid>

            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <TextField 
                label="Localidad" 
                sx={{ width: '100%' }} 
                {...register('address.locality')} 
                error={!!errors.address?.locality} 
                helperText={errors.address?.locality?.message} />
            </Grid>
            <Grid size={0.5}></Grid>

            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <TextField 
                label="Municipio" 
                sx={{ width: '100%' }} 
                {...register('address.municipality')} 
                error={!!errors.address?.municipality} 
                helperText={errors.address?.municipality?.message} />
            </Grid>
            <Grid size={0.5}></Grid>

            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <TextField 
                label="Estado" 
                sx={{ width: '100%' }} 
                {...register('address.state')} 
                error={!!errors.address?.state} 
                helperText={errors.address?.state?.message} />
            </Grid>
            <Grid size={0.5}></Grid>

            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <TextField 
                label="Código Postal" 
                sx={{ width: '100%' }} 
                {...register('address.postalCode')} 
                error={!!errors.address?.postalCode} 
                helperText={errors.address?.postalCode?.message} />
            </Grid>
            <Grid size={0.5}></Grid>

            <Grid size={0.5}></Grid>
            <Grid size={11}>
              <TextField 
                label="País" 
                sx={{ width: '100%' }} 
                {...register('address.country')} 
                error={!!errors.address?.country} 
                helperText={errors.address?.country?.message} />
            </Grid>
            <Grid size={0.5}></Grid>

          </Grid>
        </Paper>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 2, mb: 1 }}
          disabled={loading || !!successMessage}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrar Cuenta'}
        </Button>
      </form>
      
      <Box sx={{ textAlign: 'center' }}>
        <Link href="/login" variant="body2">
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>
      </Box>
    </Box>
  );
};

export default RegisterForm;