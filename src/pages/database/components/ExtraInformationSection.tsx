import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { FunctionComponent, PropsWithChildren } from "react";

export const ExtraInfoRow: FunctionComponent<
  PropsWithChildren<{ title: string }>
> = ({ title, children }) => {
  return (
    <Stack>
      <Typography>
        <b>{title}</b>
      </Typography>
      {children}
    </Stack>
  );
};
