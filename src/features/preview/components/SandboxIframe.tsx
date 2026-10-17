import React from 'react';
import { Box } from '@mui/material';

interface SandboxIframeProps {
  srcDoc: string;
  title?: string;
  refreshKey?: number;
}

/**
 * Componente SandboxIframe que ejecuta la vista previa aislada con sandbox="allow-scripts"
 * e inyecta el documento consolidado mediante el atributo srcDoc (HU-15).
 */
export const SandboxIframe: React.FC<SandboxIframeProps> = ({
  srcDoc,
  title = 'Vista Previa del Proyecto (Sandbox)',
  refreshKey = 0,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: 420,
        bgcolor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <iframe
        key={refreshKey}
        title={title}
        sandbox="allow-scripts"
        srcDoc={srcDoc}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
          backgroundColor: '#ffffff',
        }}
      />
    </Box>
  );
};

export default SandboxIframe;
