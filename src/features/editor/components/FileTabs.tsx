import React from 'react';
import { Tabs, Tab, Box, Chip } from '@mui/material';
import HtmlRoundedIcon from '@mui/icons-material/HtmlRounded';
import CssRoundedIcon from '@mui/icons-material/CssRounded';
import JavascriptRoundedIcon from '@mui/icons-material/JavascriptRounded';
import { useAppDispatch, useAppSelector } from '../../../core/hooks/redux_hooks';
import { setActiveFile } from '../store/editorSlice';
import type { EditorFileName } from '../types/editor_types';

const FILE_TABS_CONFIG: Array<{
  fileName: EditorFileName;
  label: string;
  badge: string;
  icon: React.ReactElement;
}> = [
  {
    fileName: 'index.html',
    label: 'index.html',
    badge: 'HTML5',
    icon: <HtmlRoundedIcon fontSize="small" sx={{ color: '#e34c26' }} />,
  },
  {
    fileName: 'styles.css',
    label: 'styles.css',
    badge: 'CSS3',
    icon: <CssRoundedIcon fontSize="small" sx={{ color: '#264de4' }} />,
  },
  {
    fileName: 'script.js',
    label: 'script.js',
    badge: 'JS',
    icon: <JavascriptRoundedIcon fontSize="small" sx={{ color: '#f7df1e' }} />,
  },
];

export const FileTabs: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeFile = useAppSelector((state) => state.editor.activeFile);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: EditorFileName) => {
    dispatch(setActiveFile(newValue));
  };

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 1,
      }}
    >
      <Tabs
        value={activeFile}
        onChange={handleTabChange}
        aria-label="Pestañas de archivos del proyecto"
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ minHeight: 44 }}
      >
        {FILE_TABS_CONFIG.map((tab) => (
          <Tab
            key={tab.fileName}
            value={tab.fileName}
            icon={tab.icon}
            iconPosition="start"
            label={tab.label}
            sx={{
              textTransform: 'none',
              fontWeight: activeFile === tab.fileName ? 700 : 500,
              minHeight: 44,
              py: 0.5,
            }}
          />
        ))}
      </Tabs>

      <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1, pr: 1 }}>
        <Chip
          size="small"
          variant="outlined"
          color="primary"
          label={
            activeFile === 'index.html'
              ? 'HTML + Emmet'
              : activeFile === 'styles.css'
              ? 'CSS Lint Activo'
              : 'JS Validación Sintáctica'
          }
        />
      </Box>
    </Box>
  );
};

export default FileTabs;
