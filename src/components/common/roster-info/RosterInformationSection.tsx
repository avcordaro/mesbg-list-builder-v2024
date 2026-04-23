import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { FunctionComponent, PropsWithChildren } from "react";
import { slugify } from "../../../utils/string.ts";

export type RosterInformationSectionProps = {
  title: string;
};

export const RosterInformationSection: FunctionComponent<
  PropsWithChildren<RosterInformationSectionProps>
> = (props) => {
  return (
    <Box data-test-id={`roster-information--${slugify(props.title)}`}>
      <Divider textAlign="center">
        <Typography variant="h6" className="middle-earth">
          {props.title}
        </Typography>
      </Divider>
      <Box>{props.children}</Box>
    </Box>
  );
};
