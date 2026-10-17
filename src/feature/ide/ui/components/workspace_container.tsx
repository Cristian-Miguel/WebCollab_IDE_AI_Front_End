import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Alert,
  Divider,
  Grid,
} from '@mui/material';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import { useAppDispatch, useAppSelector } from '../../../../core/hooks/redux_hooks';
import { joinSession, updateParticipantsList } from '../../../dashboard/store/dashboard_slice';
import type { SessionParticipantModel } from '../../../dashboard/types/session_types';
import { createSessionSocket, createYjsWebSocket } from '../../../../core/config/socket';
import { JoinSessionButton } from './join_session_button';
import { useAuth } from '../../../auth/hook/use_auth';
import { EditorContainer } from '../../../../features/editor/components/EditorContainer';

interface WorkspaceContainerProps {
  sessionId: string;
}

export const WorkspaceContainer: React.FC<WorkspaceContainerProps> = ({ sessionId }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { currentSession, participants, error } = useAppSelector((state) => state.dashboard);
  const [wsConnected, setWsConnected] = useState(false);
  const [yjsConnected, setYjsConnected] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const joinedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionId || joinedRef.current === sessionId) {
      return;
    }
    joinedRef.current = sessionId;

    let isMounted = true;
    const socket = createSessionSocket(sessionId, user?.uuid);
    let yjsWs: WebSocket | null = null;

    const connectRealtime = async () => {
      const resultAction = await dispatch(joinSession(sessionId));

      if (!isMounted) {
        return;
      }

      if (joinSession.rejected.match(resultAction)) {
        setWsError(resultAction.payload || 'No se pudo ingresar a la sesión (Límite de 4 usuarios alcanzado).');
        return;
      }

      socket.on('connect', () => {
        if (isMounted) {
          setWsConnected(true);
          setWsError(null);
        }
      });

      socket.on('user_joined', (payload: { sessionId: string; participants: SessionParticipantModel[] }) => {
        if (isMounted && payload?.participants) {
          dispatch(updateParticipantsList(payload.participants));
        }
      });

      socket.on('session_error', (errPayload: { code?: number; message?: string }) => {
        if (isMounted) {
          setWsError(errPayload?.message || 'Error de conexión a la sala colaborativa.');
          setWsConnected(false);
        }
      });

      socket.on('connect_error', (err: Error) => {
        if (isMounted) {
          setWsError(err.message || 'Conexión rechazada por límite de usuarios.');
          setWsConnected(false);
        }
      });

      socket.on('disconnect', () => {
        if (isMounted) {
          setWsConnected(false);
        }
      });

      socket.connect();

      try {
        yjsWs = createYjsWebSocket(sessionId, user?.uuid);
        yjsWs.onopen = () => {
          if (isMounted) {
            setYjsConnected(true);
          }
        };
        yjsWs.onclose = () => {
          if (isMounted) {
            setYjsConnected(false);
          }
        };
        yjsWs.onerror = () => {
          if (isMounted) {
            setYjsConnected(false);
          }
        };
      } catch {
        setYjsConnected(false);
      }
    };

    void connectRealtime();

    return () => {
      isMounted = false;
      socket.disconnect();
      if (yjsWs && yjsWs.readyState === WebSocket.OPEN) {
        yjsWs.close();
      }
    };
  }, [sessionId, dispatch, user?.uuid]);

  const activeCount = participants.filter((p) => p.activo).length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {(error || wsError) && (
        <Alert severity="error">
          {wsError || error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CodeRoundedIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {currentSession?.nombre || 'Sesión Colaborativa'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {sessionId}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    label={wsConnected ? 'Socket.IO Conectado' : 'Socket.IO Desconectado'}
                    color={wsConnected ? 'success' : 'default'}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={yjsConnected ? 'Yjs CRDT Activo' : 'Yjs En Espera'}
                    color={yjsConnected ? 'info' : 'default'}
                    variant="outlined"
                  />
                  <JoinSessionButton sessionId={sessionId} onJoined={() => {}} />
                </Box>
              </Box>
            </Paper>

            <EditorContainer />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupsRoundedIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={700}>
                  Participantes Activos
                </Typography>
              </Box>
              <Chip
                label={`${activeCount} / 4`}
                color={activeCount >= 4 ? 'warning' : 'primary'}
                size="small"
              />
            </Box>

            <Divider sx={{ mb: 1.5 }} />

            <List dense disablePadding>
              {participants.map((participant) => (
                <ListItem key={participant.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: participant.rol === 'PROPIETARIO' ? 'primary.main' : 'secondary.main' }}>
                      {participant.rol === 'PROPIETARIO' ? <VerifiedUserRoundedIcon fontSize="small" /> : <PersonRoundedIcon fontSize="small" />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={participant.usuario?.fullName || participant.usuario?.email || participant.usuarioId}
                    secondary={`Rol: ${participant.rol}`}
                  />
                  <Chip
                    size="small"
                    label={participant.activo ? 'Online' : 'Offline'}
                    color={participant.activo ? 'success' : 'default'}
                    variant="outlined"
                  />
                </ListItem>
              ))}
              {participants.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  Sin participantes registrados aún.
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WorkspaceContainer;
