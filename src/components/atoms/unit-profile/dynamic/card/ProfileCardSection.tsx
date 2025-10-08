import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FunctionComponent, PropsWithChildren } from "react";

type ProfileCardSectionProps = {
  title?: string;
};

export const ProfileCardSection: FunctionComponent<
  PropsWithChildren<ProfileCardSectionProps>
> = ({ title, children }) => (
  <Box>
    <Typography
      variant="h6"
      color="#800000"
      fontSize="1.15rem"
      fontWeight="bold"
      textTransform="uppercase"
    >
      {title}
    </Typography>
    <Box>{children}</Box>
  </Box>
);
