import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './manage_route';
import { PublicRoutes } from './public_routes';
import { PrivateRoutes } from './private_routes';

import Header from '../components/header';
import Footer from '../components/footer';
// import MenuSideBar from '../components/menu_side_bar';

// --- LAYOUTS ---

// Layout para páginas públicas (sin Header/Sidebar)
const AuthLayout = () => {
  return (
    // Estilo básico para páginas de login/registro
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Outlet />
    </div>
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