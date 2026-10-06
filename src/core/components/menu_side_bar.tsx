import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Divider, Box } from '@mui/material';
import { useAuth } from '../../feature/auth/hook/use_auth';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

interface MenuSideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define la estructura de un elemento de menú
interface MenuItemConfig {
  name: string;
  path: string;
  icon: React.ElementType;
  roles: string[]; // Roles que tienen acceso
}

// Configuración de todos los elementos del menú
const MENU_ITEMS: MenuItemConfig[] = [
  { name: 'Dashboard', path: '/dashboard', icon: DashboardIcon, roles: ['customer', 'administrador', 'soporte'] },
  { name: 'Gestión de Usuarios', path: '/users/list', icon: PeopleIcon, roles: ['administrador', 'soporte'] },
  { name: 'Configuración de Cuenta', path: '/settings', icon: SettingsIcon, roles: ['customer', 'administrador', 'soporte'] },
  // ... Añade más elementos aquí (ej. Reportes, Roles, etc.)
];

const MenuSideBar: React.FC<MenuSideBarProps> = ({ isOpen, onClose }) => {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();

  // Filtra los elementos del menú basándose en el rol del usuario
  const filteredMenuItems = MENU_ITEMS.filter(item => 
    item.roles.includes(userRole || 'public') // 'public' si no hay rol
  );

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };
  
  const handleLogout = () => {
      logout();
      onClose();
      navigate('/login');
  }

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      variant="temporary"
      PaperProps={{
        sx: { width: 250 }, // Ancho del Sidebar
      }}
    >
      <Box sx={{ p: 2, height: '64px', display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" color="primary">
          Menú Principal
        </Typography>
      </Box>
      <Divider />
      
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item.path)}>
              <item.icon sx={{ mr: 2 }} />
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        
        <Divider sx={{ my: 1 }} />
        
        {/* Opción de Logout siempre visible */}
        <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 2 }} />
              <ListItemText primary="Cerrar Sesión" />
            </ListItemButton>
        </ListItem>
        
      </List>
      
      <Box sx={{ p: 2, mt: 'auto', textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Rol: {userRole ? userRole.toUpperCase() : 'N/A'}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default MenuSideBar;