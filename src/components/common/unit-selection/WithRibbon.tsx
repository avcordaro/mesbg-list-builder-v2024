import Box from "@mui/material/Box";
import { FunctionComponent, PropsWithChildren } from "react";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";

type WithRibbonProps = {
  label: string;
  hideRibbon: boolean;
  type?: "selector" | "warband";
};

export const WithRibbon: FunctionComponent<
  PropsWithChildren<WithRibbonProps>
> = ({ label, hideRibbon = false, type = "selector", children }) => {
  const { mode } = useThemeContext();
  const color = mode === "dark" ? "400" : "800";

  if (hideRibbon) {
    return children;
  }

  const options =
    type === "selector"
      ? {
          top: 12,
          right: -40,
          width: 120,
          transform: "rotate(45deg)",
          fontSize: 12,
          py: 0,
          backgroundColor: ({ palette }) => palette.grey[color],
          color: ({ palette }) => palette.getContrastText(palette.grey[color]),
        }
      : {
          top: 20,
          left: -55,
          width: 180,
          transform: "rotate(-45deg)",
          fontSize: 18,
          py: 0.5,
          backgroundColor: ({ palette }) => palette.grey[color],
          color: ({ palette }) => palette.getContrastText(palette.grey[color]),
        };

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
          boxShadow: 2,
          zIndex: 1,
          ...options,
        }}
      >
        {label}
      </Box>

      {children}
    </Box>
  );
};
