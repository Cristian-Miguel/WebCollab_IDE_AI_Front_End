import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../core/hooks/redux_hooks';
import { createSessionSocket } from '../../../core/config/socket';
import { setOnlineUsers, setPresenceConnected } from '../store/presenceSlice';
import { updateParticipantsList } from '../../../feature/dashboard/store/dashboard_slice';
import type { PresenceParticipant } from '../types/presence_types';

export const usePresenceSocket = (sessionId: string, userId?: string, enabled: boolean = true) => {
  const dispatch = useAppDispatch();
  const [wsError, setWsError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !enabled) {
      return;
    }

    let isMounted = true;
    const socket = createSessionSocket(sessionId, userId);

    const handleParticipantsUpdate = (payload: {
      sessionId: string;
      participants: PresenceParticipant[];
    }) => {
      if (isMounted && payload?.participants) {
        dispatch(setOnlineUsers(payload.participants));
        dispatch(updateParticipantsList(payload.participants));
      }
    };

    socket.on('connect', () => {
      if (isMounted) {
        dispatch(setPresenceConnected(true));
        setWsError(null);
      }
    });

    socket.on('user_joined', handleParticipantsUpdate);
    socket.on('presence_updated', handleParticipantsUpdate);

    socket.on('session_error', (errPayload: { code?: number; message?: string }) => {
      if (isMounted) {
        setWsError(errPayload?.message || 'Error de conexión a la sala colaborativa.');
        dispatch(setPresenceConnected(false));
      }
    });

    socket.on('connect_error', (err: Error) => {
      if (isMounted) {
        setWsError(err.message || 'Conexión rechazada por límite de usuarios.');
        dispatch(setPresenceConnected(false));
      }
    });

    socket.on('disconnect', () => {
      if (isMounted) {
        dispatch(setPresenceConnected(false));
      }
    });

    socket.connect();

    return () => {
      isMounted = false;
      dispatch(setPresenceConnected(false));
      socket.disconnect();
    };
  }, [sessionId, userId, enabled, dispatch]);

  return { wsError };
};

export default usePresenceSocket;
