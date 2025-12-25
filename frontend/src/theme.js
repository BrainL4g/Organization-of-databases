import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e88e5',
      light: '#6ab7ff',
      dark: '#005cb2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#43a047',
    },
    success: {
      main: '#43a047',
    },
    background: {
      default: '#f8fbff',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          borderRadius: '20px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          background: 'linear-gradient(90deg, #1976d2 0%, #1e88e5 100%)',
        },
      },
    },
  },
});

export default theme;