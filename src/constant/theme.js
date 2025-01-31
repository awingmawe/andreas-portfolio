import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#e2ecf6',
    },
    secondary: {
      main: '#bbe3fd',
    },
    ternary: {
      main: '#063970',
    },
    common: {
      white: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Custom font stack
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          color: '#063970',
          boxShadow: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#e2ecf6',
          color: '#063970',
          borderRadius: 5,
        },
      },
    },
  },
})

export default theme
