// src/core/config/theme_manage.ts

import { createTheme, responsiveFontSizes, type Theme } from '@mui/material/styles';
import { COLORS } from '../const/colors';
import { TEXT_SIZES } from '../const/text_size';

/**
 * Crea y configura el tema personalizado de Material UI.
 * Este tema usa los colores y tamaños de texto definidos en las constantes.
 * @returns {Theme} El objeto de tema configurado.
 */
export const createCustomTheme = (): Theme => {
  let theme = createTheme({
    palette: {
      primary: {
        main: COLORS.primary,
      },
      secondary: {
        main: COLORS.secondary,
      },
      error: {
        main: COLORS.error,
      },
      success: {
        main: COLORS.success,
      },
      background: {
        default: COLORS.background,
      },
      text: {
        primary: COLORS.textPrimary,
        secondary: COLORS.textSecondary,
      },
      warning: {
        main: COLORS.warning
      }
    },

    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      // Mapeamos los tamaños de texto del objeto TEXT_SIZES a las variantes tipográficas de MUI
      h1: { fontSize: TEXT_SIZES.h1 },
      h2: { fontSize: TEXT_SIZES.h2 },
      h3: { fontSize: TEXT_SIZES.h3 },
      h4: { fontSize: TEXT_SIZES.h4 },
      h5: { fontSize: TEXT_SIZES.h5 },
      h6: { fontSize: TEXT_SIZES.h6 },
      body1: { fontSize: TEXT_SIZES.body1 },
      body2: { fontSize: TEXT_SIZES.body2 },
      subtitle1: { fontSize: TEXT_SIZES.subtitle1 },
      subtitle2: { fontSize: TEXT_SIZES.subtitle2 },
    },

    // Componentes Globales (Opcional: puedes definir estilos base para componentes)
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true, // Deshabilita la elevación por defecto en botones
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Sombra personalizada
          },
        },
      },
    }
  });

  // Aplicar tipografía responsiva
  // Esto ajustará automáticamente los tamaños de fuente en diferentes tamaños de pantalla
  theme = responsiveFontSizes(theme);

  return theme;
};