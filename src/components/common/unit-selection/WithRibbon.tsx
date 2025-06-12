import Box from "@mui/material/Box";
import { FunctionComponent, PropsWithChildren } from "react";

type WithRibbonProps = {
  label: string;
  hideRibbon: boolean;
};

export const WithRibbon: FunctionComponent<
  PropsWithChildren<WithRibbonProps>
> = ({ label, hideRibbon = false, children }) => {
  return hideRibbon ? (
    children
  ) : (
    <Box position="relative" sx={{ overflow: "hidden" }}>
      {/* Ribbon */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: -40,
          width: 120,
          backgroundColor: ({ palette }) => palette.grey.A700,
          color: "white",
          textAlign: "center",
          transform: "rotate(45deg)",
          zIndex: 1,
          fontSize: 12,
          fontWeight: "bold",
          py: 0,
          boxShadow: 2,
        }}
      >
        {label}
      </Box>

      {children}
    </Box>
  );
};
