import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: 2.5,
        mt: 'auto',
        flexShrink: 0,
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Nexo · Plataforma de Desarrollo Colaborativo en Tiempo Real. Todos los derechos reservados.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
