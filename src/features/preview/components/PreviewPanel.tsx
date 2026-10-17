import React, { useEffect, useState, useCallback } from 'react';
import * as Y from 'yjs';
import { Paper, Box, Typography, IconButton, Chip, Tooltip } from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import { useAppSelector } from '../../../core/hooks/redux_hooks';
import { SandboxIframe } from './SandboxIframe';
import { buildPreviewDocument } from '../utils/buildPreviewDocument';
import { getOrCreateSessionYDoc, subscribeToSessionYDoc } from '../utils/yjsDocRegistry';

interface PreviewPanelProps {
  sessionId?: string;
  yDoc?: Y.Doc | null;
}

/**
 * Panel de Vista Previa (Sandbox Preview - HU-15) que escucha cambios en el Yjs Document
 * e inyecta dinámicamente el código consolidado (HTML + CSS + JS) en el srcDoc del SandboxIframe.
 */
export const PreviewPanel: React.FC<PreviewPanelProps> = ({ sessionId, yDoc: externalYDoc }) => {
  const files = useAppSelector((state) => state.editor.files);
  const [refreshKey, setRefreshKey] = useState(0);
  const [srcDoc, setSrcDoc] = useState<string>(() =>
    buildPreviewDocument({
      html: files['index.html'].content,
      css: files['styles.css'].content,
      javascript: files['script.js'].content,
    })
  );

  const computeFromYDocOrStore = useCallback(
    (doc?: Y.Doc | null) => {
      const yHtml = doc?.getText('index.html').toString() || '';
      const yCss = doc?.getText('styles.css').toString() || '';
      const yJs = doc?.getText('script.js').toString() || '';

      const consolidated = buildPreviewDocument({
        html: yHtml.length > 0 ? yHtml : files['index.html'].content,
        css: yCss.length > 0 ? yCss : files['styles.css'].content,
        javascript: yJs.length > 0 ? yJs : files['script.js'].content,
      });

      setSrcDoc(consolidated);
    },
    [files]
  );

  // 1. Escuchar cambios directamente sobre el Yjs Document (Y.Doc update + Y.Text observe)
  useEffect(() => {
    let activeDoc: Y.Doc | null =
      externalYDoc ?? (sessionId ? getOrCreateSessionYDoc(sessionId) : null);

    let cleanupDocListeners: (() => void) | null = null;

    const attachDocObservers = (doc: Y.Doc) => {
      if (cleanupDocListeners) {
        cleanupDocListeners();
      }

      const handleUpdate = () => {
        computeFromYDocOrStore(doc);
      };

      const htmlText = doc.getText('index.html');
      const cssText = doc.getText('styles.css');
      const jsText = doc.getText('script.js');

      doc.on('update', handleUpdate);
      htmlText.observe(handleUpdate);
      cssText.observe(handleUpdate);
      jsText.observe(handleUpdate);

      computeFromYDocOrStore(doc);

      cleanupDocListeners = () => {
        doc.off('update', handleUpdate);
        htmlText.unobserve(handleUpdate);
        cssText.unobserve(handleUpdate);
        jsText.unobserve(handleUpdate);
      };
    };

    if (activeDoc) {
      attachDocObservers(activeDoc);
    }

    const unsubscribeRegistry = sessionId
      ? subscribeToSessionYDoc(sessionId, (doc) => {
          activeDoc = doc;
          attachDocObservers(doc);
        })
      : undefined;

    return () => {
      unsubscribeRegistry?.();
      cleanupDocListeners?.();
    };
  }, [sessionId, externalYDoc, computeFromYDocOrStore]);

  // 2. Sincronizar también cuando el usuario edita localmente en las pestañas del store
  useEffect(() => {
    const doc = externalYDoc ?? (sessionId ? getOrCreateSessionYDoc(sessionId) : null);
    computeFromYDocOrStore(doc);
  }, [
    files['index.html'].content,
    files['styles.css'].content,
    files['script.js'].content,
    sessionId,
    externalYDoc,
    computeFromYDocOrStore,
  ]);

  const handleManualRefresh = () => {
    const doc = externalYDoc ?? (sessionId ? getOrCreateSessionYDoc(sessionId) : null);
    computeFromYDocOrStore(doc);
    setRefreshKey((prev) => prev + 1);
  };

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
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VisibilityRoundedIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2" fontWeight={700}>
            Vista Previa en Tiempo Real (Sandbox Preview)
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            size="small"
            icon={<SecurityRoundedIcon />}
            label="sandbox='allow-scripts'"
            color="success"
            variant="outlined"
          />
          <Tooltip title="Recargar vista previa">
            <IconButton size="small" onClick={handleManualRefresh} aria-label="Recargar vista previa">
              <RefreshRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <SandboxIframe srcDoc={srcDoc} refreshKey={refreshKey} />
    </Paper>
  );
};

export default PreviewPanel;
