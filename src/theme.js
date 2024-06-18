import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#CEEEFF', // Replace with your primary color
      },
      secondary: {
        main: '#EEFCFF', // Replace with your secondary color
      },
      background: {
        default: '#FFFFFF', // Replace with your background color
        paper: '#fff',
      },
      text: {
        primary: '#000000', // Replace with your text color
      },
      typography: {
        h4: {
          fontWeight: 600,
        },
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: '#66cef773', // Replace with your desired hover color
            },
          },
        },
      },
    },
  });
  
  export default theme;