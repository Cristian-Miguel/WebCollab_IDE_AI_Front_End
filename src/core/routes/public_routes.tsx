import { type ReactNode } from 'react';
import LoginPage from          '../../features/auth/ui/page/login_page';
import RegisterPage from       '../../features/auth/ui/page/register_page';
import ResetPasswordPage from  '../../features/auth/ui/page/reset_password_page';
import ValidatedEmailPage from '../../features/auth/ui/page/validated_email_page';

interface RouteConfig {
  path: string;
  element: ReactNode;
  name: string;
  index?: boolean;
}

export const PublicRoutes: RouteConfig[] = [
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage/>,
  },
  {
    name: 'Registro',
    path: '/register',
    element: <RegisterPage/>,
  },
  {
    name: 'Restablecer Contraseña',
    path: '/forgot-password',
    element: <ResetPasswordPage/>,
  },
  {
    name: 'Cambiar Contraseña',
    path: '/forgot-password/:token',
    element: <ResetPasswordPage/>,
  },
  {
    name: 'Validación de Correo',
    path: '/validate-email/:token', // Asume que el token se pasa por URL
    element: <ValidatedEmailPage/>,
  },
  {
    name: 'Raíz',
    path: '/',
    index: true,
    element: <LoginPage/>,
  },
];