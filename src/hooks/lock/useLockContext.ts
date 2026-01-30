import { useContext } from "react";
import { LockContext } from "./LockContext.tsx";

export const useLockContext = () => {
  const context = useContext(LockContext);

  if (!context)
    throw new Error("useLockContext must be used within LockContext");

  return context;
};
