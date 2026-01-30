import Button from "@mui/material/Button";
import { FaLock, FaLockOpen } from "react-icons/fa";
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
      startIcon={lock ? <FaLockOpen /> : <FaLock />}
      onClick={() => toggleLock()}
    >
      {lock ? "Unlock" : "Lock"} roster
    </Button>
  );
};
