import { io, type Socket } from 'socket.io-client';
import { SERVER_BASE_URL, YJS_WS_BASE_URL } from '../const/api_routes';
import { getAccessToken } from './jwt_manage';

export const createSessionSocket = (sessionId: string, userId?: string): Socket => {
  const token = getAccessToken() || undefined;
  return io(SERVER_BASE_URL, {
    autoConnect: false,
    reconnection: false,
    withCredentials: true,
    auth: {
      token,
      sessionId,
      userId,
    },
    query: {
      sessionId,
      ...(userId ? { userId } : {}),
    },
  });
};

export const createYjsWebSocket = (sessionId: string, userId?: string): WebSocket => {
  const token = getAccessToken() || '';
  const params = new URLSearchParams();
  if (token) {
    params.set('token', token);
  }
  if (userId) {
    params.set('userId', userId);
  }
  const queryString = params.toString();
  const wsUrl = `${YJS_WS_BASE_URL}/${encodeURIComponent(sessionId)}${queryString ? `?${queryString}` : ''}`;
  return new WebSocket(wsUrl);
};
