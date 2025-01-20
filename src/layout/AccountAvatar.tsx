import { Person } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { User } from "firebase/auth";
import { useState, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/FirebaseAuthContext.tsx";
import { useScreenSize } from "../hooks/useScreenSize.ts";

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
        onClick={() => navigate("/sign-in")}
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    signOut();
    handleClose();
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
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
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
        <MenuItem onClick={logout}>Logout</MenuItem>
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
