import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: 'rgba(0, 169, 255, 0.3)', // Replace with your primary color
      },
      secondary: {
        main: '#EEFCFF', // Replace with your secondary color
      },
      background: {
        default: '#FFFFFF', // Replace with your background color
      },
      text: {
        primary: '#000000', // Replace with your text color
      },
    },
  });
  
  export default theme;