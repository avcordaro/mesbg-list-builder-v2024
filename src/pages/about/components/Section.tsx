import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PropsWithChildren, ReactNode } from "react";

export const Section = ({
  title,
  additionalButton,
  children,
}: PropsWithChildren<{ title: string; additionalButton?: ReactNode }>) => {
  return (
    <Stack direction="column" flexWrap="wrap" sx={{ maxWidth: "72ch" }}>
      <Typography variant="h4" className="middle-earth">
        {title} {!!additionalButton && additionalButton}
      </Typography>
      <Stack gap={2}>{children}</Stack>
    </Stack>
  );
};
