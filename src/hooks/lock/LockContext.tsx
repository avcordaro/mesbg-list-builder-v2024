import { createContext, ReactNode, useState } from "react";

type LockContextType = {
  lock: boolean;
  toggleLock: () => void;
};

export const LockContext = createContext<LockContextType | undefined>(
  undefined,
);

export const LockContextProvider = ({ children }: { children: ReactNode }) => {
  const [lock, setLock] = useState(false);

  const toggleLock = () => setLock((prev) => !prev);

  return (
    <LockContext.Provider
      value={{
        lock,
        toggleLock,
      }}
    >
      {children}
    </LockContext.Provider>
  );
};
