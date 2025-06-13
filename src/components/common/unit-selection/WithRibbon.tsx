import Box from "@mui/material/Box";
import { FunctionComponent, PropsWithChildren } from "react";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";

type WithRibbonProps = {
  label: string;
  hideRibbon: boolean;
};

export const WithRibbon: FunctionComponent<
  PropsWithChildren<WithRibbonProps>
> = ({ label, hideRibbon = false, children }) => {
  const { mode } = useThemeContext();
  const color = mode === "dark" ? "400" : "800";

  if (hideRibbon) {
    return children;
  }

  return hideRibbon ? (
    children
  ) : (
    <Box position="relative" sx={{ overflow: "hidden" }}>
      {/* Ribbon */}
      <Box
        sx={{
          position: "absolute",
          textAlign: "center",
          fontWeight: "bold",
          boxShadow: 6,
          zIndex: 1,
          top: 20,
          left: -55,
          width: 180,
          transform: "rotate(-45deg)",
          fontSize: 15,
          py: 0.1,
          m: -0.2,
          backgroundColor: ({ palette }) => palette.grey[color],
          color: ({ palette }) => palette.getContrastText(palette.grey[color]),
        }}
      >
        {label}
      </Box>

      {children}
    </Box>
  );
};
