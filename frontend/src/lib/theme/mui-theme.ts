import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

const getTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#171717' },
          background: { default: '#ffffff', paper: '#ffffff' },
          text: { primary: '#171717', secondary: '#737373' },
        }
      : {
          primary: { main: '#ededed' },
          background: { default: '#0a0a0a', paper: '#0a0a0a' },
          text: { primary: '#ededed', secondary: '#a3a3a3' },
        }),
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
});

export default getTheme;
