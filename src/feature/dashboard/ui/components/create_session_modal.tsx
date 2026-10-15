import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { createSessionSchema, type CreateSessionFormData } from '../../validation/session_schema';
import { useAppDispatch, useAppSelector } from '../../../../core/hooks/redux_hooks';
import { createSession, clearDashboardError } from '../../store/dashboard_slice';

interface CreateSessionModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.dashboard);
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSessionFormData>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
    },
  });

  const handleClose = () => {
    reset();
    setLocalError(null);
    dispatch(clearDashboardError());
    onClose();
  };

  const onSubmit = async (data: CreateSessionFormData) => {
    setLocalError(null);
    try {
      const resultAction = await dispatch(
        createSession({
          nombre: data.nombre,
          descripcion: data.descripcion || undefined,
        })
      );

      if (createSession.fulfilled.match(resultAction)) {
        const createdSession = resultAction.payload;
        handleClose();
        navigate(`/workspace/${createdSession.id}`);
      } else if (createSession.rejected.match(resultAction)) {
        setLocalError(resultAction.payload || 'No se pudo crear la sesión colaborativa');
      }
    } catch (err: unknown) {
      const e = err as Error;
      setLocalError(e.message || 'Error inesperado al crear la sesión');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddBoxRoundedIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Crear Sesión Colaborativa
          </Typography>
        </Box>
        <IconButton aria-label="close" onClick={handleClose} size="small">
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configura una nueva sala para invitar a tus compañeros a programar en tiempo real.
          </Typography>

          {(localError || error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {localError || error}
            </Alert>
          )}

          <TextField
            {...register('nombre')}
            label="Nombre de la sesión"
            placeholder="Ej: Microservicio de Pagos o Algoritmos Grafos"
            fullWidth
            required
            margin="normal"
            error={Boolean(errors.nombre)}
            helperText={errors.nombre?.message}
            disabled={loading}
            autoFocus
          />

          <TextField
            {...register('descripcion')}
            label="Descripción del proyecto"
            placeholder="Breve detalle sobre los objetivos de esta sesión..."
            fullWidth
            multiline
            rows={3}
            margin="normal"
            error={Boolean(errors.descripcion)}
            helperText={errors.descripcion?.message}
            disabled={loading}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AddBoxRoundedIcon />}
          >
            {loading ? 'Creando...' : 'Crear Sesión'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateSessionModal;
