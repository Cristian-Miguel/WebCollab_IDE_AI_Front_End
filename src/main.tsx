import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthProvider from './feature/auth/context/auth_provider.tsx';
import './core/style/index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
