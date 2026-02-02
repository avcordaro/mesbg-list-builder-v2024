import { Button, IconButton } from "@mui/material";
import { TbMobiledata, TbMobiledataOff } from "react-icons/tb";
import { useScreenSize } from "../../hooks/calculations-and-displays/useScreenSize.ts";
import { useLockContext } from "../../hooks/lock/useLockContext";

export const RosterLockButton = () => {
  const screen = useScreenSize();
  const { lock, toggleLock } = useLockContext();

  if (screen.isDesktop) {
    // Show a button with text label on large screens
    return (
      <Button
        variant="contained"
        sx={{
          whiteSpace: "nowrap", // Prevent text from wrapping
          minWidth: "20ch",
          backgroundColor: (theme) => theme.palette.grey[400],
          color: (theme) => theme.palette.success.contrastText,
          "&:hover": {
            backgroundColor: (theme) => theme.palette.grey[500],
          },
        }}
        startIcon={lock ? <TbMobiledataOff /> : <TbMobiledata />}
        onClick={() => toggleLock()}
      >
        {lock ? "Drag & Drop: Off" : "Drag & Drop: On"}
      </Button>
    );
  }

  // Fallback to icon button on smaller screens such as tablets and mobile phones.
  return (
    <IconButton
      aria-label="Toggle Drag & Drop"
      onClick={() => toggleLock()}
      sx={{
        backgroundColor: (theme) => theme.palette.grey[400],
        color: (theme) => theme.palette.success.contrastText,
        "&:hover": {
          backgroundColor: (theme) => theme.palette.grey[500],
        },
      }}
    >
      {lock ? <TbMobiledataOff /> : <TbMobiledata />}
    </IconButton>
  );
};
