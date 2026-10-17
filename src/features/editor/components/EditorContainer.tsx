import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import { FileTabs } from './FileTabs';
import { MonacoEditorWrapper } from './MonacoEditorWrapper';
import { useAppSelector } from '../../../core/hooks/redux_hooks';

export const EditorContainer: React.FC = () => {
  const { activeFile, files } = useAppSelector((state) => state.editor);
  const currentFile = files[activeFile];

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: 'background.default',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CodeRoundedIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2" fontWeight={700}>
            Editor Multi-Lenguaje
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Archivo activo: <strong>{currentFile.label}</strong> ({currentFile.language.toUpperCase()})
        </Typography>
      </Box>

      <FileTabs />
      <MonacoEditorWrapper />
    </Paper>
  );
};

export default EditorContainer;
