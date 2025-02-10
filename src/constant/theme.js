import { createTheme } from '@mui/material/styles'

const themeDefault = createTheme()

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
    h2: {
      [themeDefault.breakpoints.down('sm')]: {
        fontSize: '32px',
      },
    },
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
    MuiToggleButton: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          color: '#063970',
          border: '1px solid #063970',
          '&.Mui-selected': {
            backgroundColor: '#063970',
            color: 'white',
            '&:hover': {
              backgroundColor: '#063970',
            },
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: '#063970',
            '& + .MuiSwitch-track': {
              backgroundColor: '#063970',
              opacity: 0.5,
            },
          },
        },
        track: {
          backgroundColor: '#063970',
          opacity: 0.2,
        },
      },
    },
  },
})

export default theme
