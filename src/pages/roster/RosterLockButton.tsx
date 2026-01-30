import Button from "@mui/material/Button";
import { TbMobiledata, TbMobiledataOff } from "react-icons/tb";
import { useLockContext } from "../../hooks/lock/useLockContext";

export const RosterLockButton = () => {
  const { lock, toggleLock } = useLockContext();

  return (
    <Button
      color="inherit"
      variant="contained"
      sx={{
        whiteSpace: "nowrap", // Prevent text from wrapping
        minWidth: "20ch",
      }}
      startIcon={lock ? <TbMobiledataOff /> : <TbMobiledata />}
      onClick={() => toggleLock()}
    >
      {lock ? "Drag & Drop: Off" : "Drag & Drop: On"}
    </Button>
  );
};
