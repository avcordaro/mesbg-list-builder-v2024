import {
  Announcement,
  AutoAwesome,
  CategoryOutlined,
  ChevronLeftOutlined,
  FolderOutlined,
  Info,
  OpenInNew,
  Segment,
  Settings,
} from "@mui/icons-material";
import BugReportIcon from "@mui/icons-material/BugReport";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import { Badge, Collapse, CSSObject, Theme, Tooltip } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List/List";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon/ListItemIcon";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { AiFillTrophy } from "react-icons/ai";
import { FaChessRook, FaDatabase } from "react-icons/fa";
import { GiMightyForce, GiSwordsEmblem } from "react-icons/gi";
import { HiFire } from "react-icons/hi";
import { HiIdentification } from "react-icons/hi2";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import logo from "../assets/images/logo.svg";
import title from "../assets/images/title-v2024.png";
import { icons as groupIcons } from "../components/common/group-icon/icons.tsx";
import { FactionLogo } from "../components/common/images/FactionLogo.tsx";
import { DrawerTypes } from "../components/drawer/drawers.tsx";
import { ModalTypes } from "../components/modal/modals.tsx";
import { charts } from "../constants/charts.ts";
import { OpenNavigationDrawerEvent } from "../events/OpenNavigationDrawerEvent.ts";
import { useAppState } from "../state/app";
import { useGameModeState } from "../state/gamemode";
import { useRosterBuildingState } from "../state/roster-building";
import { slugify } from "../utils/string.ts";

const drawerWidth = 320;

const baseMenuIconStyles = {
  fontSize: "2rem",
  position: "absolute",
  transition: "opacity 0.3s ease, transform 0.3s ease",
};

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  padding: theme.spacing(0, 2),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

type NavLink = {
  icon: ReactNode;
  label: string;
  action: () => void;
  active: boolean;
  children?: NavItem[];
  showCaret?: boolean;
  disabled?: boolean;
};

type NavDivider = {
  divider: boolean;
};
type NavItem = NavDivider | NavLink;
const isDivider = (item: NavItem): item is NavDivider =>
  !!(item as NavDivider).divider;

export const NavItemLink = ({
  item,
  open,
  pl = 0,
}: {
  item: NavLink;
  open: boolean;
  pl?: number;
}) => {
  const [expanded, setExpanded] = useState<boolean>(item.showCaret);

  return (
    <>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          sx={[
            { minHeight: 48, pr: 2.5, pl: pl + 2.5 },
            open ? { justifyContent: "initial" } : { justifyContent: "center" },
          ]}
          selected={item.active}
          onClick={() => {
            if (item.showCaret) {
              setExpanded(!expanded);
              window.dispatchEvent(
                new Event("mlb-event--open-navigation-drawer"),
              );
            } else {
              item.action();
            }
          }}
          disabled={item.disabled}
          data-test-id={slugify(item.label) + "--nav-link"}
        >
          <Tooltip title={open ? "" : item.label}>
            <ListItemIcon
              sx={[
                { minWidth: 0, justifyContent: "center" },
                open ? { mr: 3 } : { mr: "auto" },
              ]}
            >
              {item.icon}
            </ListItemIcon>
          </Tooltip>

          <ListItemText
            primary={item.label}
            sx={[
              {
                "& span": {
                  display: "inline-block",
                  width: "21ch",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              },
              open ? { opacity: 1 } : { opacity: 0 },
            ]}
          />
          {item.children && item.showCaret && open && (
            <> {expanded ? <ExpandLess /> : <ExpandMore />}</>
          )}
        </ListItemButton>
      </ListItem>
      {item.children && item.children.length > 0 && (
        <Collapse in={(!expanded && open) || !item.showCaret}>
          {item.children?.map((subItem, index) =>
            isDivider(subItem) ? (
              <Divider key={index} />
            ) : (
              <NavItemLink
                key={index}
                item={subItem}
                open={open}
                pl={open ? pl + 3 : 0}
              />
            ),
          )}
        </Collapse>
      )}
    </>
  );
};

export const Navigation: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { rosterId } = useParams();
  const { rosters, groups } = useRosterBuildingState();
  const { openSidebar, setCurrentModal } = useAppState();
  const { startNewGame, gameState } = useGameModeState();
  const groupMap = Object.fromEntries(groups.map((group) => [group.id, group]));

  const groupedRosters = rosters.reduce(
    (groups, roster) => {
      const group = roster.group || "ungrouped";
      groups[group] = [...(groups[group] || []), roster];
      return groups;
    },
    { ungrouped: [] },
  );

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

  const navigation: NavItem[] = [
    {
      icon: <Segment />,
      label: "My Rosters",
      action: () => navigate("/my-rosters"),
      active: location.pathname === "/my-rosters",
      children: [
        ...Object.entries(groupedRosters)
          .filter(([key]) => key !== "ungrouped")
          .sort((a, b) =>
            groupMap[a[0]].name.localeCompare(groupMap[b[0]].name),
          )
          .map(([group, groupRosters]) => ({
            action: () => {},
            active:
              location.pathname === `/rosters/${encodeURIComponent(group)}`,
            icon: groupIcons[groupMap[group]?.icon] || <FolderOutlined />,
            label: groupMap[group]?.name || "Unknown name",
            children: [
              ...groupRosters
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((roster) => ({
                  action: () => navigate(`/roster/${roster.id}`),
                  active: location.pathname === `/roster/${roster.id}`,
                  icon: <FactionLogo faction={roster.armyList} />,
                  label: roster.name,
                })),
            ],
            showCaret: true,
          })),
        ...groupedRosters.ungrouped
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((roster) => ({
            action: () => navigate(`/roster/${roster.id}`),
            active: location.pathname === `/roster/${roster.id}`,
            icon: <FactionLogo faction={roster.armyList} />,
            label: roster.name,
          })),
      ],
      showCaret: false,
    },
    { divider: true },
    {
      icon: (
        <Badge
          variant="dot"
          color="info"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          badgeContent={gameState[rosterId] ? 1 : 0}
        >
          <FaChessRook style={{ fontSize: "1.5rem" }} />
        </Badge>
      ),
      label: "Game Mode",
      action: () => {
        if (rosterId) {
          const roster = rosters.find((roster) => roster.id === rosterId);
          if (roster) {
            const ongoingGame = gameState[roster.id];
            if (!ongoingGame) startNewGame(roster);
            navigate(`/gamemode/-/${rosterId}`);
            return;
          }
        }
        navigate("/gamemode/start");
      },
      active: location.pathname.startsWith("/gamemode"),
    },

    {
      icon: <AiFillTrophy style={{ fontSize: "1.5rem" }} />,
      label: "Match History",
      action: () => navigate("/match-history"),
      active: location.pathname === "/match-history",
    },
    {
      icon: <CategoryOutlined />,
      label: "My Collection",
      action: () => navigate("/collection"),
      active: location.pathname === "/collection",
    },
    { divider: true },
    {
      icon: <AutoAwesome />,
      label: "Special Rules",
      action: () => openSidebar(DrawerTypes.SPECIAL_RULE_SEARCH),
      active: false,
    },
    {
      icon: <HiFire style={{ fontSize: "1.5rem" }} />,
      label: "Magical Powers",
      action: () => openSidebar(DrawerTypes.MAGICAL_POWER_SEARCH),
      active: false,
    },
    {
      icon: <GiMightyForce style={{ fontSize: "1.5rem" }} />,
      label: "Heroic Actions",
      action: () => openSidebar(DrawerTypes.HEROIC_ACTION_SEARCH),
      active: false,
    },
    {
      icon: <HiIdentification style={{ fontSize: "1.5rem" }} />,
      label: "Profiles",
      action: () => openSidebar(DrawerTypes.PROFILE_SEARCH),
      active: false,
    },
    {
      icon: <GiSwordsEmblem style={{ fontSize: "1.5rem" }} />,
      label: "Charts",
      action: () => {},
      active: false,
      children: [
        ...Object.entries(charts).map(
          ([key, name]) =>
            ({
              icon: <></>,
              label: name,
              action: () => {
                setCurrentModal(ModalTypes.CHART, {
                  selectedChart: key,
                  title: charts[key],
                });
              },
              active: false,
            }) as NavLink,
        ),
      ],
      showCaret: true,
    },
    { divider: true },
    {
      icon: <Info />,
      label: "About Us",
      action: () => navigate("/about"),
      active: location.pathname === "/about",
    },
    {
      icon: <BugReportIcon />,
      label: "Report a Bug / Correction",
      action: () =>
        (window.location.href =
          "mailto:support@mesbg-list-builder.com?subject=MESBG List Builder (v2024) - Bug/Correction"),
      active: false,
    },
    {
      icon: <Settings />,
      label: "App Settings",
      action: () => navigate("/settings"),
      active: location.pathname === "/settings",
    },
    {
      icon: <FaDatabase style={{ fontSize: "1.25rem", margin: "0 auto" }} />,
      label: "Profile Database",
      action: () => navigate("/database"),
      active: location.pathname === "/database",
    },
    { divider: true },
    {
      icon: <OpenInNew />,
      label: "v2018 Edition",
      action: () =>
        window.open("https://v2018.mesbg-list-builder.com/", "_blank").focus(),
      active: false,
    },
    {
      icon: <Announcement />,
      label: "FAQs and Errata",
      action: () =>
        window
          .open(
            "https://www.warhammer-community.com/en-gb/downloads/middle-earth-strategy-battle-game/",
            "_blank",
          )
          .focus(),
      active: false,
    },
  ];

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
            href="https://mesbg-list-builder.com/"
          >
            <img src={logo} alt="Logo" style={{ height: "50px" }} />
            <img
              src={title}
              alt="MESBG List Builder"
              style={{ maxHeight: "42px", margin: "0 .25rem" }}
            />
          </Button>
          <Box flexGrow={1} />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} id="navigation-drawer">
        <DrawerHeader>
          <Typography
            variant="h6"
            className="middle-earth"
            sx={{ textAlign: "start" }}
          >
            Menu
          </Typography>
        </DrawerHeader>
        <Divider />
        <List component="nav">
          {navigation.map((item, index) =>
            isDivider(item) ? (
              <Divider key={index} />
            ) : (
              <NavItemLink key={index} item={item} open={open} />
            ),
          )}
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1, minWidth: "50ch" }}>
        <DrawerHeader />
        {children}
      </Box>
    </Stack>
  );
};
