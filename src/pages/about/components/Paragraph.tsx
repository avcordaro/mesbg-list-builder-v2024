import Typography from "@mui/material/Typography";
import { PropsWithChildren } from "react";

export const Paragraph = ({
  children,
}: PropsWithChildren<PropsWithChildren>) => {
  return (
    <Typography variant="body1" sx={{ fontSize: "18px" }}>
      {children}
    </Typography>
  );
};
