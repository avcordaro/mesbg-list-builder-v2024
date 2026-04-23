import { ChevronLeftOutlined } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import logo from "../../assets/images/logo.svg";
import title from "../../assets/images/title-v2024.png";
import { AccountAvatar } from "../../components/common/user-avatar/AccountAvatar.tsx";
import { OpenNavigationDrawerEvent } from "../../events/OpenNavigationDrawerEvent.ts";
import { AppBar } from "./AppBar.tsx";
import { MenuDrawer } from "./MenuDrawer.tsx";
import { MenuDrawerHeader } from "./MenuDrawerHeader.tsx";
import { NavigationMenu } from "./menu/NavigationMenu.tsx";

export const drawerWidth = 320;

const baseMenuIconStyles = {
  fontSize: "2rem",
  position: "absolute",
  transition: "opacity 0.3s ease, transform 0.3s ease",
};

export const Navigation: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);

  const toggleMenuDrawer = () => {
    setOpen(!open);
    window.dispatchEvent(new OpenNavigationDrawerEvent(!open));
  };

  useEffect(() => {
    function openMenuDrawer() {
      setOpen(true);
      window.dispatchEvent(new OpenNavigationDrawerEvent(true));
    }

    window.addEventListener(
      "mlb-event--open-navigation-drawer",
      openMenuDrawer,
    );
    return () =>
      window.removeEventListener(
        "mlb-event--open-navigation-drawer",
        openMenuDrawer,
      );
  }, []);

  return (
    <Stack direction="row">
      <AppBar position="fixed" sx={{ backgroundColor: "#1c1c1e" }} open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleMenuDrawer}
            edge="start"
            sx={{
              marginRight: 5,
              position: "relative",
              width: "2rem",
            }}
          >
            <MenuIcon
              sx={{
                ...baseMenuIconStyles,
                opacity: open ? 0 : 1,
                transform: open ? "rotate(-180deg)" : "rotate(0deg)",
              }}
            />
            <ChevronLeftOutlined
              sx={{
                ...baseMenuIconStyles,
                opacity: open ? 1 : 0,
                transform: open ? "rotate(0deg)" : "rotate(180deg)",
              }}
            />
          </IconButton>
          {/* Logo */}
          <Button
            aria-label="logo"
            sx={{ mr: 2 }}
            href={window.location.protocol + "//" + window.location.host}
          >
            <img src={logo} alt="Logo" style={{ height: "50px" }} />
            <img
              src={title}
              alt="MESBG List Builder"
              style={{ maxHeight: "42px", margin: "0 .25rem" }}
            />
          </Button>
          <Box flexGrow={1} />
          <AccountAvatar />
        </Toolbar>
      </AppBar>
      <MenuDrawer variant="permanent" open={open} id="navigation-drawer">
        <MenuDrawerHeader>
          <Typography
            variant="h6"
            className="middle-earth"
            sx={{ textAlign: "start" }}
          >
            Menu
          </Typography>
        </MenuDrawerHeader>
        <Divider />
        <NavigationMenu open={open} />
      </MenuDrawer>
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <MenuDrawerHeader />
        {children}
      </Box>
    </Stack>
  );
};
