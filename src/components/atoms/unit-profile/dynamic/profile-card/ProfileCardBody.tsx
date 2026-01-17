import { SxProps } from "@mui/material";
import Stack from "@mui/material/Stack";
import { FunctionComponent, PropsWithChildren } from "react";

export const ProfileCardBody: FunctionComponent<
  PropsWithChildren<{ sx?: SxProps }>
> = ({ sx, children }) => {
  return (
    <Stack gap={1} sx={{ ...sx }}>
      {children}
    </Stack>
  );
};
