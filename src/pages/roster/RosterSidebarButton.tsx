import { Info, WarningRounded } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { useRosterWarnings } from "../../hooks/calculations-and-displays/useRosterWarnings.ts";
import { useScreenSize } from "../../hooks/calculations-and-displays/useScreenSize.ts";

export const RosterSidebarButton = () => {
  const screen = useScreenSize();
  const warnings = useRosterWarnings();

  if (screen.isDesktop) {
    // The toggle button is not rendered as the roster-info sidebar is always shown on desktop.
    return null;
  }

  return (
    <IconButton
      aria-label="open drawer"
      onClick={() =>
        window.dispatchEvent(new Event("mlb-event--open-roster-info"))
      }
      sx={
        warnings.length > 0
          ? {
              backgroundColor: (theme) => theme.palette.error.main,
              color: (theme) => theme.palette.error.contrastText,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.error.light,
              },
            }
          : {
              backgroundColor: (theme) => theme.palette.success.main,
              color: (theme) => theme.palette.success.contrastText,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.success.light,
              },
            }
      }
    >
      {warnings.length > 0 ? <WarningRounded /> : <Info />}
    </IconButton>
  );
};
