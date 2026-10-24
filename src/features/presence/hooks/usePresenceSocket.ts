import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../core/hooks/redux_hooks';
import { createSessionSocket } from '../../../core/config/socket';
import {
  setOnlineUsers,
  setPresenceConnected,
  setPresenceError,
} from '../store/presenceSlice';
import { updateParticipantsList } from '../../../feature/dashboard/store/dashboard_slice';
import {
  WS_DISCONNECT_LIMIT_REACHED,
  type PresenceParticipant,
} from '../types/presence_types';

export interface SocketErrorWithData extends Error {
  data?: {
    code?: number;
    reason?: string;
    message?: string;
  };
}

/**
 * HU-12-14 & HU-26: Hook de cliente Socket.IO Handshake y control de presencia en tiempo real.
 * Maneja la sincronización de usuarios conectados (SADD / SREM en Redis) y el rechazo inmediato
 * de conexión cuando SCARD >= 4 ('WS Disconnect: Limit reached').
 */
export const usePresenceSocket = (
  sessionId: string,
  userId?: string,
  enabled: boolean = true
) => {
  const dispatch = useAppDispatch();
  const [wsError, setWsError] = useState<string | null>(null);
  const [isLimitReached, setIsLimitReached] = useState<boolean>(false);

  useEffect(() => {
    if (!sessionId || !enabled) {
      return;
    }

    let isMounted = true;
    const socket = createSessionSocket(sessionId, userId);

    const handleParticipantsUpdate = (payload: {
      sessionId: string;
      participants: PresenceParticipant[];
      activeUserIds?: string[];
      activeCount?: number;
      disconnectedUserId?: string;
    }) => {
      if (isMounted && payload?.participants) {
        dispatch(setOnlineUsers(payload.participants));
        dispatch(updateParticipantsList(payload.participants));
      }
    };

    const handleLimitReachedRejection = (rawMessage?: string, code?: number, reason?: string) => {
      const isCapacityRejected =
        code === 403 ||
        reason === 'SESSION_FULL' ||
        rawMessage?.includes(WS_DISCONNECT_LIMIT_REACHED) ||
        rawMessage?.includes('SESSION_FULL') ||
        rawMessage?.includes('Limit reached');

      const finalMessage = isCapacityRejected
        ? `${WS_DISCONNECT_LIMIT_REACHED} — La sesión colaborativa ha alcanzado el límite máximo de 4 usuarios activos.`
        : rawMessage || 'Error de conexión a la sala colaborativa.';

      if (isMounted) {
        setIsLimitReached(Boolean(isCapacityRejected));
        setWsError(finalMessage);
        dispatch(setPresenceError(finalMessage));
        dispatch(setPresenceConnected(false));
      }

      if (isCapacityRejected) {
        socket.disconnect();
      }
    };

    socket.on('connect', () => {
      if (isMounted) {
        dispatch(setPresenceConnected(true));
        dispatch(setPresenceError(null));
        setWsError(null);
        setIsLimitReached(false);
      }
    });

    socket.on('user_joined', handleParticipantsUpdate);
    socket.on('presence_updated', handleParticipantsUpdate);
    socket.on('user_left', handleParticipantsUpdate);

    socket.on(
      'session_error',
      (errPayload: { code?: number; reason?: string; message?: string }) => {
        handleLimitReachedRejection(
          errPayload?.message,
          errPayload?.code,
          errPayload?.reason
        );
      }
    );

    socket.on('connect_error', (err: SocketErrorWithData) => {
      handleLimitReachedRejection(
        err.data?.message || err.message,
        err.data?.code,
        err.data?.reason
      );
    });

    socket.on('disconnect', (reason: string) => {
      if (isMounted) {
        dispatch(setPresenceConnected(false));
        if (reason === 'io server disconnect') {
          setWsError((prev) => prev || WS_DISCONNECT_LIMIT_REACHED);
          dispatch(setPresenceError(WS_DISCONNECT_LIMIT_REACHED));
          setIsLimitReached(true);
        }
      }
    });

    socket.connect();

    return () => {
      isMounted = false;
      dispatch(setPresenceConnected(false));
      socket.disconnect();
    };
  }, [sessionId, userId, enabled, dispatch]);

  return { wsError, isLimitReached };
};

export default usePresenceSocket;
