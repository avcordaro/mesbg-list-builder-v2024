import {
  createContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
} from "react";

type LockContextType = {
  lock: boolean;
  toggleLock: () => void;
};

export const LockContext = createContext<LockContextType | undefined>(
  undefined,
);

export const LockContextProvider = ({ children }: { children: ReactNode }) => {
  const [lock, setLock] = useState(false);

  const toggleLock = useCallback(() => {
    setLock((prev) => !prev);
  }, []);

  const contextValue = useMemo(
    () => ({
      lock,
      toggleLock,
    }),
    [lock, toggleLock],
  );

  return (
    <LockContext.Provider value={contextValue}>{children}</LockContext.Provider>
  );
};
