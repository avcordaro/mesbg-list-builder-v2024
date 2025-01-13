import { createTheme } from "@mui/material";

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 800, // adjusted from the default 900
    lg: 1200,
    xl: 1536,
  },
};

const lightTheme = createTheme({
  breakpoints: breakpoints,
});

const darkTheme = createTheme({
  breakpoints: breakpoints,
  colorSchemes: {
    dark: true,
  },
});

export { lightTheme, darkTheme };
