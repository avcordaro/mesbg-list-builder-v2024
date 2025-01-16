import { Person } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useAuth } from "../firebase/FirebaseAuthContext.tsx";
import { useScreenSize } from "../hooks/useScreenSize.ts";

export const AccountAvatar = () => {
  const auth = useAuth();
  const screen = useScreenSize();

  // TODO list;
  // - Navigate to login page instead of auto sign in with google

  return (
    <>
      {!screen.isMobile && (
        <Typography sx={{ mr: 2 }} fontWeight="bold">
          {auth.user?.displayName || "Not signed in"}
        </Typography>
      )}
      <Avatar
        src={auth.user?.photoURL}
        sx={{ bgcolor: ({ palette }) => palette.primary.main }}
        onClick={() => auth.signInWithGoogle()}
      >
        <Person sx={{ color: ({ palette }) => palette.primary.contrastText }} />
      </Avatar>
    </>
  );
};
