import { createContext, ReactNode } from "react";
import { useUserPreferences } from "../../state/preference";

type LockContextType = {
  lock: boolean;
  toggleLock: () => void;
};

export const LockContext = createContext<LockContextType | undefined>(
  undefined,
);

export const LockContextProvider = ({ children }: { children: ReactNode }) => {
  const { preferences, setPreference } = useUserPreferences();

  const toggleLock = () =>
    setPreference("dragAndDropRoster", !preferences.dragAndDropRoster);

  return (
    <LockContext.Provider
      value={{
        lock: preferences.dragAndDropRoster,
        toggleLock,
      }}
    >
      {children}
    </LockContext.Provider>
  );
};
