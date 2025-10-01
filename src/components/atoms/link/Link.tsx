import { useTheme } from "@mui/material/styles";
import { FunctionComponent } from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";

export const Link: FunctionComponent<LinkProps> = (props) => {
  const theme = useTheme();

  return (
    <RouterLink
      {...props}
      style={{
        color: theme.palette.secondary.main,
        ...props.style,
      }}
    >
      {props.children}
    </RouterLink>
  );
};
