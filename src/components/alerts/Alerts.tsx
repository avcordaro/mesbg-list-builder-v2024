import { AlertColor, Portal, Slide, Snackbar, Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { useAppState } from "../../state/app";
import { useThemeContext } from "../../theme/ThemeContext.tsx";
import { slugify } from "../../utils/string.ts";
import { alertMap, AlertTypes } from "./alert-types.tsx";

const ListBuilderAlert = ({ id, type }: { id: string; type: AlertTypes }) => {
  const { dismissAlert } = useAppState();
  const { mode } = useThemeContext();

  const { variant, content, options } = alertMap.get(type);

  // Auto hide of alert, if configured
  useEffect(() => {
    if (options && options.autoHideAfter) {
      const timeout = setTimeout(() => dismissAlert(id), options.autoHideAfter);
      return () => {
        clearTimeout(timeout);
      };
    }
    return () => null;
  }, [id, options, dismissAlert]);

  return (
    <Slide direction="right" in={true}>
      <Alert
        onClose={() => dismissAlert(id)}
        variant={mode === "dark" ? "filled" : "standard"}
        sx={{ width: "100%" }}
        icon={false}
        severity={variant as AlertColor}
        data-test-id={`global-alert--${slugify(type)}`}
      >
        <Box sx={{ maxWidth: "72ch" }}>{content}</Box>
      </Alert>
    </Slide>
  );
};

export const Alerts = () => {
  const { activeAlerts } = useAppState();

  return (
    <Portal>
      <Snackbar
        open={true}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Slide}
      >
        <Stack gap={1}>
          {activeAlerts.map((alert) => (
            <ListBuilderAlert id={alert.id} key={alert.id} type={alert.type} />
          ))}
        </Stack>
      </Snackbar>
    </Portal>
  );
};
