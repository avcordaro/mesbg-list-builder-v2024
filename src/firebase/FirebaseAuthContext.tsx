import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { getIdToken, onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "./config";
import { FirebaseAuthFunctions, useFirebaseAuth } from "./useFirebaseAuth.ts";

// Define types for the AuthContext
type AuthContextProps = {
  user: User | null;
  idToken: string | null;
  loading: boolean;
  firebaseEnabled: boolean;
} & FirebaseAuthFunctions;

// Define the default state of AuthContext
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const authFunctions = useFirebaseAuth();

  useEffect(() => {
    // If auth is miss configured, skip it.
    if (!auth) return () => null;
    // Listen to user authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const token = await getIdToken(firebaseUser);
        setIdToken(token);
      } else {
        setIdToken(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        firebaseEnabled: !!auth,
        user,
        idToken,
        loading,
        ...authFunctions,
      }}
    >
      {loading && !!auth ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100svw",
            height: "100svh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="inherit" size={100} thickness={2} />
          <Typography variant="overline">
            Getting account information...
          </Typography>
        </Box>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
