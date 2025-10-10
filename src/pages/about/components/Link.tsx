import { useTheme } from "@mui/material/styles";
import { PropsWithChildren } from "react";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";

export const Link = ({ to, children }: PropsWithChildren<{ to: string }>) => {
  const theme = useTheme();
  const themeContext = useThemeContext();

  return (
    <a
      href={to}
      target="_blank"
      rel="noreferrer"
      style={{
        color:
          themeContext.mode === "dark"
            ? theme.palette.secondary.light
            : theme.palette.secondary.dark,
      }}
    >
      {children}
    </a>
  );
};
