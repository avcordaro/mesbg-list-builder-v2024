import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FunctionComponent, PropsWithChildren } from "react";

type ProfileCardSectionProps = {
  title?: string;
  sx?: SxProps;
};

export const ProfileCardSection: FunctionComponent<
  PropsWithChildren<ProfileCardSectionProps>
> = ({ title, children, sx }) => (
  <Box sx={sx}>
    <Typography
      variant="h6"
      color="#800000"
      fontSize="1.05rem"
      fontWeight="bold"
      textTransform="uppercase"
    >
      {title}
    </Typography>
    <Box>{children}</Box>
  </Box>
);
