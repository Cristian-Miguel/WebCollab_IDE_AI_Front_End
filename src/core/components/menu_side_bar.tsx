import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { useAuth } from '../../features/auth/hook/use_auth';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import { CreateSessionModal } from '../../features/dashboard/ui/components/create_session_modal';

interface MenuSideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItemConfig {
  id: string;
  name: string;
  path: string;
  icon: React.ElementType;
  action?: 'create-session';
}

const MENU_ITEMS: MenuItemConfig[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    icon: DashboardRoundedIcon,
  },
  {
    id: 'create-session',
    name: 'Crear Sesión Colaborativa',
    path: '/dashboard?action=create',
    icon: AddBoxRoundedIcon,
    action: 'create-session',
  },
  {
    id: 'workspace',
    name: 'Unirse a Sesión (Workspace)',
    path: '/workspace',
    icon: MeetingRoomRoundedIcon,
  },
  {
    id: 'profile',
    name: 'Perfil',
    path: '/settings',
    icon: PersonRoundedIcon,
  },
];

const MenuSideBar: React.FC<MenuSideBarProps> = ({ isOpen, onClose }) => {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleMenuClick = (item: MenuItemConfig) => {
    onClose();
    if (item.action === 'create-session') {
      setIsCreateModalOpen(true);
      return;
    }
    navigate(item.path);
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={onClose}
        variant="temporary"
        PaperProps={{
          sx: {
            width: 280,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              background: 'linear-gradient(145deg, #7771ff, #514bce)',
            }}
          >
            <TerminalRoundedIcon fontSize="small" />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" fontWeight={750} lineHeight={1.2}>
              Nexo
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {user?.email || 'Menú Principal'}
            </Typography>
          </Box>
        </Box>
        <Divider />

        <List sx={{ px: 1, py: 1.5, flexGrow: 1 }}>
          {MENU_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isSelected =
              item.action !== 'create-session' &&
              (location.pathname === item.path ||
                (item.id === 'workspace' && location.pathname.startsWith('/workspace')) ||
                (item.id === 'profile' && (location.pathname === '/settings' || location.pathname === '/profile')));

            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => handleMenuClick(item)}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: isSelected ? 'primary.main' : 'text.secondary' }}>
                    <IconComponent />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: '0.92rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}

          <Divider sx={{ my: 1.5 }} />

          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                py: 1.2,
                color: 'error.main',
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                <LogoutRoundedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Cerrar Sesión"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: '0.92rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />
        <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Rol: {userRole ? userRole.toUpperCase() : 'CUSTOMER'}
          </Typography>
        </Box>
      </Drawer>

      <CreateSessionModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default MenuSideBar;
