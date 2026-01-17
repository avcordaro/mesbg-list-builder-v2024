import { Box, SxProps } from "@mui/material";
import { FunctionComponent, PropsWithChildren } from "react";

export const ProfileCardFooter: FunctionComponent<
  PropsWithChildren<{ sx?: SxProps }>
> = ({ sx, children }) => {
  return (
    <Box
      sx={{
        ...sx,
        position: "absolute",
        bottom: 8,
        width: "calc(100% - 4rem)",
      }}
    >
      {children}
    </Box>
  );
};
