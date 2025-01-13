import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { createContext, useContext, ReactNode } from "react";
import { useUserPreferences } from "../state/preference"; // Import your themes
import { lightTheme, darkTheme } from "./themes";

type ThemeContextType = {
  toggleTheme: () => void;
  mode: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useThemeContext must be used within ThemeContextProvider");
  return context;
};

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const { preferences, setPreference } = useUserPreferences();

  const toggleTheme = () => {
    setPreference("darkMode", !preferences.darkMode);
  };

  const theme = preferences.darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{ toggleTheme, mode: preferences.darkMode ? "dark" : "light" }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
