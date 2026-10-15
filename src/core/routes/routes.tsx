import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './manage_route';
import { PublicRoutes } from './public_routes';
import { PrivateRoutes } from './private_routes';

import Header from '../components/header';
import Footer from '../components/footer';
import { Box, Chip, Container, Typography } from '@mui/material';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
// import MenuSideBar from '../components/menu_side_bar';

// --- LAYOUTS ---

// Layout para páginas públicas (sin Header/Sidebar)
const AuthLayout = () => {
  return (
    <Box className="auth-page">
      <Container maxWidth="lg" className="auth-container">
        <Box className="auth-showcase">
          <Box className="auth-brand">
            <Box className="auth-brand-mark"><TerminalRoundedIcon /></Box>
            <Typography variant="h6" fontWeight={750}>Nexo</Typography>
          </Box>
          <Box className="auth-showcase-copy">
            <Chip
              icon={<AutoAwesomeRoundedIcon />}
              label="Tu espacio para crear"
              className="auth-showcase-chip"
              size="small"
            />
            <Typography component="h1" className="auth-showcase-title">
              Ideas que toman forma, en equipo.
            </Typography>
            <Typography className="auth-showcase-description">
              Un entorno de desarrollo colaborativo para que puedas concentrarte en construir lo que sigue.
            </Typography>
          </Box>
          <Box className="auth-code-card" aria-hidden="true">
            <Box className="auth-code-dots"><i /><i /><i /></Box>
            <Typography component="p" className="auth-code-line auth-code-muted">// construye algo increíble</Typography>
            <Typography component="p" className="auth-code-line"><span>const</span> equipo = {'{'}</Typography>
            <Typography component="p" className="auth-code-line auth-code-indent">ideas: <b>'sin límites'</b>,</Typography>
            <Typography component="p" className="auth-code-line auth-code-indent">personas: <b>'en sintonía'</b></Typography>
            <Typography component="p" className="auth-code-line">{'}'};</Typography>
          </Box>
          <Typography className="auth-showcase-footnote">Un solo lugar. Muchas posibilidades.</Typography>
        </Box>
        <Box className="auth-form-panel">
          <Outlet />
        </Box>
      </Container>
      <Typography className="auth-page-footer">© {new Date().getFullYear()} Nexo · Colabora, crea y comparte.</Typography>
    </Box>
  );
};

// Layout para páginas privadas (con navegación)
const MainLayout = () => {
  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        {/* <MenuSideBar /> */}
        <main style={{ flexGrow: 1, padding: '20px' }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            {PrivateRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>
        
        <Route element={<PublicRoute />}>
          <Route path="/" element={<AuthLayout />}>
            {PublicRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        <Route path="*" element={<div>404: Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};