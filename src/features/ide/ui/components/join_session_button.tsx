import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import { useAppDispatch, useAppSelector } from '../../../../core/hooks/redux_hooks';
import { joinSession, clearDashboardError } from '../../../dashboard/store/dashboard_slice';

interface JoinSessionButtonProps {
  sessionId?: string;
  showInput?: boolean;
  onJoined?: (sessionId: string) => void;
}

export const JoinSessionButton: React.FC<JoinSessionButtonProps> = ({
  sessionId: initialSessionId = '',
  showInput = false,
  onJoined,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.dashboard);
  const [inputSessionId, setInputSessionId] = useState(initialSessionId);
  const [localError, setLocalError] = useState<string | null>(null);

  const targetSessionId = (showInput ? inputSessionId : initialSessionId || inputSessionId).trim();

  const handleJoin = async () => {
    setLocalError(null);
    dispatch(clearDashboardError());

    if (!targetSessionId) {
      setLocalError('Ingresa un ID de sesión válido para unirte.');
      return;
    }

    const resultAction = await dispatch(joinSession(targetSessionId));
    if (joinSession.fulfilled.match(resultAction)) {
      if (onJoined) {
        onJoined(targetSessionId);
      } else {
        navigate(`/workspace/${targetSessionId}`);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        {showInput && (
          <TextField
            size="small"
            label="ID de la Sesión"
            placeholder="UUID de la sesión"
            value={inputSessionId}
            onChange={(e) => setInputSessionId(e.target.value)}
            disabled={loading}
            sx={{ minWidth: 260 }}
          />
        )}
        <Button
          variant="contained"
          color="secondary"
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <MeetingRoomRoundedIcon />}
          onClick={handleJoin}
          disabled={loading}
          sx={{ borderRadius: 2, px: 2.5, py: 1, textTransform: 'none', fontWeight: 600 }}
        >
          {loading ? 'Uniéndose...' : 'Unirse a Sesión'}
        </Button>
      </Box>

      {(localError || error) && (
        <Alert severity="error" onClose={() => { setLocalError(null); dispatch(clearDashboardError()); }}>
          {localError || error}
        </Alert>
      )}
    </Box>
  );
};

export default JoinSessionButton;
