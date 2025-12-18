import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xll: true; 

  }
}

export const themeOptions: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xll: 2000,
    }
  },

  palette: {
    secondary: {
      main: '#F8F9FA',
    },
    info: {
      main: '#F8D4CC',

    },
  },
};


export const theme = createTheme(themeOptions)

