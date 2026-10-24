import React from 'react';
import { Paper, Box, Typography, Chip, Divider, List, Alert } from '@mui/material';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { useAppSelector } from '../../../core/hooks/redux_hooks';
import { UserBadge } from './UserBadge';
import type { PresenceParticipant } from '../types/presence_types';

interface PresenceSidebarProps {
  participants?: PresenceParticipant[];
}

export const PresenceSidebar: React.FC<PresenceSidebarProps> = ({ participants: propParticipants }) => {
  const { onlineUsers, isConnected, syncLatencyMs, connectionError } = useAppSelector(
    (state) => state.presence
  );
  const dashboardParticipants = useAppSelector((state) => state.dashboard.participants);

  const list =
    propParticipants && propParticipants.length > 0
      ? propParticipants
      : onlineUsers.length > 0
      ? onlineUsers
      : dashboardParticipants;

  const sortedParticipants = [...list].sort((a, b) => {
    if (a.rol === 'PROPIETARIO' && b.rol !== 'PROPIETARIO') return -1;
    if (a.rol !== 'PROPIETARIO' && b.rol === 'PROPIETARIO') return 1;
    if (a.activo && !b.activo) return -1;
    if (!a.activo && b.activo) return 1;
    return 0;
  });

  const activeCount = sortedParticipants.filter((p) => p.activo).length;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: 'background.paper',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupsRoundedIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={700}>
            Usuarios Conectados
          </Typography>
        </Box>
        <Chip
          label={`${activeCount} / 4 Activos`}
          color={activeCount >= 4 ? 'warning' : 'primary'}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Chip
          size="small"
          icon={<BoltRoundedIcon />}
          label={`Latencia CRDT: ${syncLatencyMs}ms (< 200ms)`}
          color={syncLatencyMs < 200 ? 'success' : 'warning'}
          variant="outlined"
        />
        <Typography variant="caption" color={isConnected ? 'success.main' : 'text.secondary'} fontWeight={600}>
          {isConnected ? '● En vivo' : '○ Conectando...'}
        </Typography>
      </Box>

      {connectionError && (
        <Alert severity="warning" sx={{ mb: 1.5, py: 0.5 }}>
          {connectionError}
        </Alert>
      )}

      <Divider sx={{ mb: 1.5 }} />

      <List dense disablePadding sx={{ flex: 1 }}>
        {sortedParticipants.map((participant) => (
          <UserBadge key={participant.id} participant={participant} />
        ))}
        {sortedParticipants.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
            Esperando conexión de participantes...
          </Typography>
        )}
      </List>
    </Paper>
  );
};

export default PresenceSidebar;
