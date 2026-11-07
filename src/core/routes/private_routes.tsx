import { type ReactNode } from 'react';
import HomePage from '../../features/home/ui/page/home_page';
import SettingsPage from '../../features/user/ui/page/setting_page';
import WorkspacePage from '../../features/ide/ui/page/workspace_page';

interface RouteConfig {
  path: string;
  element: ReactNode;
  name: string;
  index?: boolean;
}

export const PrivateRoutes: RouteConfig[] = [
  {
    name: 'Home/Dashboard',
    path: '/dashboard',
    element: <HomePage />,
  },
  {
    name: 'Configuración de Usuario',
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    name: 'Perfil de Usuario',
    path: '/profile',
    element: <SettingsPage />,
  },
  {
    name: 'Unirse a Sesión (Workspace)',
    path: '/workspace',
    element: <WorkspacePage />,
  },
  {
    name: 'Espacio de Trabajo Colaborativo',
    path: '/workspace/:sessionId',
    element: <WorkspacePage />,
  },
];
