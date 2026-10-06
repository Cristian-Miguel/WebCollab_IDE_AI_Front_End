import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles';
import { createCustomTheme } from './core/config/theme_manage.ts'
import AuthProvider from './feature/auth/context/auth_provider.tsx';
import './core/style/index.css'
import App from './App.tsx'

const theme = createCustomTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
