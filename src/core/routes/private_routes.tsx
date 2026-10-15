import { type ReactNode } from 'react';
import HomePage from '../../feature/home/ui/page/home_page';
import SettingsPage from '../../feature/user/ui/page/setting_page';
import WorkspacePage from '../../feature/ide/ui/page/workspace_page';
// import { type RouteConfig } from './public_routes';

interface RouteConfig {
  path: string;
  element: ReactNode;
  name: string;
  index?: boolean;
}

// import CreateUserPage from '../../feature/user/ui/page/create_user_page';
// import UpdateUserPage from '../../feature/user/ui/page/update_user_page';
// import ConfigUserPage from '../../feature/user/ui/page/config_user_page';


export const PrivateRoutes: RouteConfig[] = [
  {
    name: 'Home/Dashboard',
    path: '/dashboard',
    element: <HomePage />,
  },
  {
    name: 'Configuración de Usuario',
    path: '/settings',
    element: <SettingsPage/>,
  },
  {
    name: 'Espacio de Trabajo Colaborativo',
    path: '/workspace/:sessionId',
    element: <WorkspacePage />,
  },
  // {
  //   path: '/users/create',
  //   element: <CreateUserPage />,
  //   name: 'Crear Usuario',
  // },
  // {
  //   path: '/users/edit/:uuid', // Parámetro para editar por UUID
  //   element: <UpdateUserPage />,
  //   name: 'Editar Usuario',
  // },
  // {
  //   path: '/users/config',
  //   element: <ConfigUserPage />,
  //   name: 'Configuración de Usuario',
  // },
  // ... más rutas privadas
];