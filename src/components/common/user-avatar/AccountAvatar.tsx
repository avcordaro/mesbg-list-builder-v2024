import { Person } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { User } from "firebase/auth";
import { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../firebase/FirebaseAuthContext.tsx";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize";
import { useAppState } from "../../../state/app";
import { ModalTypes } from "../../modal/modals.tsx";

const SignInLink = () => {
  const screen = useScreenSize();
  const navigate = useNavigate();
  return (
    <>
      {!screen.isMobile && (
        <Typography sx={{ mr: 2 }} fontWeight="bold">
          Not signed in
        </Typography>
      )}
      <Avatar
        sx={{
          bgcolor: ({ palette }) => palette.primary.main,
          cursor: "pointer",
        }}
        onClick={() =>
          navigate("/sign-in", { state: { allowNavigation: true } })
        }
      >
        <Person sx={{ color: ({ palette }) => palette.primary.contrastText }} />
      </Avatar>
    </>
  );
};

interface AccountMenuProps {
  user: User;
  signOut: () => Promise<void>;
}

const AccountMenu = ({ user, signOut }: AccountMenuProps) => {
  const screen = useScreenSize();
  const { setCurrentModal } = useAppState();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {!screen.isMobile && (
        <Typography sx={{ mr: 2 }} fontWeight="bold">
          {user.displayName}
        </Typography>
      )}
      <Avatar
        src={user.photoURL}
        sx={{
          bgcolor: ({ palette }) => palette.primary.main,
          cursor: "pointer",
        }}
        onClick={(event) => handleClick(event)}
      >
        <Person sx={{ color: ({ palette }) => palette.primary.contrastText }} />
      </Avatar>
      <Menu
        id="account-menu"
        aria-labelledby="account menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            setCurrentModal(ModalTypes.LOGOUT_WARNING, { signOut });
            handleClose();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export const AccountAvatar = () => {
  const auth = useAuth();

  if (!auth.user) {
    return <SignInLink />;
  }

  return <AccountMenu user={auth.user} signOut={auth.signOut} />;
};
