// src/components/header.tsx

import React, { useState } from 'react';
import { Alert, AppBar, Toolbar, Typography, IconButton, Box, Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../feature/auth/hook/use_auth';
import { useNavigate } from 'react-router-dom';
import { logoutToken } from '../../feature/auth/service/auth_service';
import MenuSideBar from './menu_side_bar'; 

const Header: React.FC = () => {
  const { user, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    setLogoutError(null);
    setIsLoggingOut(true);
    try {
      await logoutToken();
      logout();
      navigate('/login', { replace: true });
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'No fue posible cerrar la sesión.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfileClick = () => {
    handleClose();
    // Redirigir a la página de configuración de usuario (self-config)
    navigate('/settings');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Botón para Abrir Sidebar (Menú Principal) */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo/Nombre de la Aplicación */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* Aquí iría el ícono de la empresa o el logo */}
          {userRole} Dashboard
        </Typography>

        {/* Menú de Usuario */}
        {user ? (
          <Box>
            <Button color="inherit" onClick={handleMenu}>
              {user.email}
            </Button>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfileClick}>Mi Perfil</MenuItem>
              <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button color="inherit" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      </Toolbar>
      
      {/* Sidebar (Drawer) */}
      <MenuSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {logoutError && (
        <Alert severity="error" onClose={() => setLogoutError(null)} sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1400 }}>
          {logoutError}
        </Alert>
      )}
    </AppBar>
  );
};

export default Header;