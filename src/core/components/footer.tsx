import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        py: 2,
        mt: 'auto', // Asegura que se vaya al final de la página dentro del MainLayout
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
      component="footer"
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Nombre de tu Empresa. Todos los derechos reservados.'}
        </Typography>
        {/* Puedes añadir más links o información aquí */}
      </Container>
    </Box>
  );
};

export default Footer;