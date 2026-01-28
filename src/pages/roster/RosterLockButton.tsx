import Button from "@mui/material/Button";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { useLockContext } from "../../lock/LockContext.tsx";

export const RosterLockButton = () => {
  const { lock, toggleLock } = useLockContext();

  return (
    <Button
      color="secondary"
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
