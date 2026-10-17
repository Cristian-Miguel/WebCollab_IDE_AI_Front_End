import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Box,
  Chip,
  Typography,
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import type { PresenceParticipant } from '../types/presence_types';

interface UserBadgeProps {
  participant: PresenceParticipant;
}

export const UserBadge: React.FC<UserBadgeProps> = ({ participant }) => {
  const isOwner = participant.rol === 'PROPIETARIO';
  const isOnline = Boolean(participant.activo);
  const displayName =
    participant.usuario?.fullName ||
    participant.usuario?.email ||
    `Usuario ${participant.usuarioId.slice(0, 6)}`;

  return (
    <ListItem
      sx={{
        px: 1.5,
        py: 1,
         mb: 0.75,
        borderRadius: 2,
        bgcolor: isOnline ? 'action.hover' : 'transparent',
        opacity: isOnline ? 1 : 0.65,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
        <ListItemAvatar sx={{ minWidth: 48 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: isOnline ? '#22c55e' : '#94a3b8',
                color: isOnline ? '#22c55e' : '#94a3b8',
                boxShadow: '0 0 0 2px #fff',
                width: 10,
                height: 10,
                borderRadius: '50%',
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: isOwner ? 'primary.main' : 'secondary.main',
                width: 36,
                height: 36,
              }}
            >
              {isOwner ? (
                <WorkspacePremiumRoundedIcon fontSize="small" />
              ) : (
                <PersonRoundedIcon fontSize="small" />
              )}
            </Avatar>
          </Badge>
        </ListItemAvatar>

        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {displayName}
              </Typography>
              {isOwner && (
                <Chip
                  size="small"
                  label="Propietario"
                  color="primary"
                  sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }}
                />
              )}
            </Box>
          }
          secondary={
            <Typography variant="caption" color="text.secondary" noWrap>
              {participant.usuario?.email || (isOwner ? 'Anfitrión de la sala' : 'Colaborador')}
            </Typography>
          }
        />
      </Box>

      <Chip
        size="small"
        label={isOnline ? 'Online' : 'Offline'}
        color={isOnline ? 'success' : 'default'}
        variant={isOnline ? 'filled' : 'outlined'}
        sx={{ fontWeight: 600, height: 24 }}
      />
    </ListItem>
  );
};

export default UserBadge;
