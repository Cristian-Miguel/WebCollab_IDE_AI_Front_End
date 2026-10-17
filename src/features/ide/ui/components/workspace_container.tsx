import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Alert,
  Grid,
} from '@mui/material';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import { useAppDispatch, useAppSelector } from '../../../../core/hooks/redux_hooks';
import { joinSession } from '../../../dashboard/store/dashboard_slice';
import { setOnlineUsers } from '../../../presence/store/presenceSlice';
import { usePresenceSocket } from '../../../presence/hooks/usePresenceSocket';
import { PresenceSidebar } from '../../../presence/components/PresenceSidebar';
import { JoinSessionButton } from './join_session_button';
import { useAuth } from '../../../auth/hook/use_auth';
import { EditorContainer } from '../../../editor/components/EditorContainer';

interface WorkspaceContainerProps {
  sessionId: string;
}

export const WorkspaceContainer: React.FC<WorkspaceContainerProps> = ({ sessionId }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { currentSession, participants, error } = useAppSelector((state) => state.dashboard);
  const { isConnected } = useAppSelector((state) => state.presence);
  const [joinCompleted, setJoinCompleted] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const joinedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionId || joinedRef.current === sessionId) {
      return;
    }
    joinedRef.current = sessionId;

    let isMounted = true;

    const initJoin = async () => {
      const resultAction = await dispatch(joinSession(sessionId));
      if (!isMounted) {
        return;
      }

      if (joinSession.rejected.match(resultAction)) {
        setJoinError(resultAction.payload || 'No se pudo ingresar a la sesión (Límite de 4 usuarios alcanzado).');
        return;
      }

      dispatch(setOnlineUsers(resultAction.payload.participants));
      setJoinCompleted(true);
    };

    void initJoin();

    return () => {
      isMounted = false;
    };
  }, [sessionId, dispatch]);

  const { wsError } = usePresenceSocket(sessionId, user?.uuid, joinCompleted);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {(error || joinError || wsError) && (
        <Alert severity="error">
          {wsError || joinError || error}
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
                    label={isConnected ? 'Socket.IO Conectado' : 'Socket.IO Desconectado'}
                    color={isConnected ? 'success' : 'default'}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={joinCompleted ? 'Yjs CRDT Activo (/yjs-ws)' : 'Yjs En Espera'}
                    color={joinCompleted ? 'info' : 'default'}
                    variant="outlined"
                  />
                  <JoinSessionButton sessionId={sessionId} onJoined={() => {}} />
                </Box>
              </Box>
            </Paper>

            <EditorContainer
              sessionId={sessionId}
              userId={user?.uuid}
              userName={user?.email || 'Desarrollador'}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <PresenceSidebar participants={participants} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default WorkspaceContainer;
