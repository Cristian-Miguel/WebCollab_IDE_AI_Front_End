// src/components/header.tsx

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../feature/auth/hook/use_auth';
import { useNavigate } from 'react-router-dom';
import { logoutToken } from '../../feature/auth/service/auth_service';
import MenuSideBar from './menu_side_bar'; 

const Header: React.FC = () => {
  const { user, logout, userRole, dispatch } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    const success = await logoutToken();
    if (success) {
      logout();
      navigate('/login');
    } else {
      dispatch({ type: 'AUTH/LOADING', payload: false });
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
              <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
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
    </AppBar>
  );
};

export default Header;