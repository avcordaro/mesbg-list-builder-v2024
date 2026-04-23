import { createContext, ReactNode } from "react";
import { useUserPreferences } from "../../state/preference";

type LockContextType = {
  lock: boolean;
  toggleLock: () => void;
};

export const LockContext = createContext<LockContextType | undefined>(
  undefined,
);

export const LockContextProvider = ({
  children,
  settingsKey: key,
}: {
  children: ReactNode;
  settingsKey: "dragAndDropUnits" | "dragAndDropRosters";
}) => {
  const { preferences, setPreference } = useUserPreferences();
  const toggleLock = () => setPreference(key, !preferences[key]);

  return (
    <LockContext.Provider
      value={{
        lock: preferences[key],
        toggleLock,
      }}
    >
      {children}
    </LockContext.Provider>
  );
};
