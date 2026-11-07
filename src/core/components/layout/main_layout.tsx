import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../header';
import Footer from '../footer';

export const MainLayout: React.FC = () => {
  return (
    <Box
      className="main-layout min-h-screen"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f4f5fa',
      }}
    >
      <Header />
      <Box
        component="main"
        className="main-content flex-grow"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          flex: '1 0 auto',
          width: '100%',
          p: { xs: 2, md: 3 },
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
