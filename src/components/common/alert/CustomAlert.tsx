import { AlertTitle } from "@mui/material";
import Alert, { AlertProps } from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { FunctionComponent, PropsWithChildren } from "react";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";

export type CustomAlertProps = {
  title: string;
  severity: AlertProps["severity"];
  onClose?: AlertProps["onClose"];
};

export const CustomAlert: FunctionComponent<
  PropsWithChildren<CustomAlertProps>
> = ({ title, severity, onClose, children }) => {
  const { mode } = useThemeContext();
  return (
    <Alert
      severity={severity}
      variant={mode === "dark" ? "filled" : "standard"}
      onClose={onClose}
      icon={false}
    >
      {title && (
        <AlertTitle>
          <Typography>{title}</Typography>
        </AlertTitle>
      )}
      {children}
    </Alert>
  );
};
