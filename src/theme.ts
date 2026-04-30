import { createTheme } from '@mui/material/styles'

export const brand = {
  deepPurple: '#8D5ACF',
  mediumPurple: '#A78BFA',
  lavender: '#E5D8FD',
  /** Full-page background (light purple instead of cream) */
  pageBackground: '#F0EBF8',
  charcoal: '#282D42',
} as const

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brand.deepPurple,
      light: brand.mediumPurple,
      dark: '#6B3FA8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: brand.mediumPurple,
      light: brand.lavender,
      dark: brand.deepPurple,
      contrastText: '#ffffff',
    },
    background: {
      default: brand.pageBackground,
      paper: '#FFFBF8',
    },
    text: {
      primary: brand.charcoal,
      secondary: 'rgba(40, 45, 66, 0.72)',
    },
    divider: 'rgba(141, 90, 207, 0.18)',
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Poppins", system-ui, sans-serif',
    h1: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700 },
    h2: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700 },
    h3: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700 },
    h4: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700 },
    h5: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 },
    h6: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 },
    button: { fontWeight: 600, letterSpacing: 0.02 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: brand.pageBackground,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${brand.deepPurple} 0%, ${brand.mediumPurple} 100%)`,
          boxShadow: '0 4px 18px rgba(141, 90, 207, 0.25)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: 'rgba(141, 90, 207, 0.22)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFBF8',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
        },
      },
    },
  },
})

export default theme
