import Box from "@mui/material/Box";
import { FunctionComponent, PropsWithChildren } from "react";
import { slugify } from "../../../../utils/string.ts";

export const TabPanel: FunctionComponent<
  PropsWithChildren<{
    tabName: string;
    visible: boolean;
  }>
> = ({ tabName, visible, children }) => {
  return (
    <div
      role="tabpanel"
      hidden={!visible}
      id={slugify(tabName)}
      aria-labelledby={slugify(tabName)}
    >
      <Box sx={{ p: 3, display: "block" }}>{children}</Box>
    </div>
  );
};
