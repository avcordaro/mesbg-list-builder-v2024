import {
  Announcement,
  AutoAwesome,
  CategoryOutlined,
  Info,
  OpenInNew,
  Segment,
  Settings,
} from "@mui/icons-material";
import BugReportIcon from "@mui/icons-material/BugReport";
import { AiFillTrophy } from "react-icons/ai";
import { FaDatabase, FaDiscord, FaPatreon } from "react-icons/fa";
import { GiSwordsEmblem } from "react-icons/gi";
import { HiIdentification } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { DrawerTypes } from "../../../components/drawer/drawers.tsx";
import { DISCORD_LINK, PATREON_LINK } from "../../../pages/home/Home.tsx";
import { useAppState } from "../../../state/app";
import { useChartMenuItems } from "./useChartMenuItems.tsx";
import { useRosterMenuItems } from "./useRosterMenuItems.tsx";

export const useMenuItems = () => {
  const navigate = useNavigate();
  const openSidebar = useAppState((state) => state.openSidebar);
  const rosterMenuItems = useRosterMenuItems();
  const chartMenuItems = useChartMenuItems();

  return [
    {
      icon: <Segment />,
      label: "My Rosters",
      action: () => navigate("/rosters"),
      active: location.pathname === "/rosters",
      children: rosterMenuItems,
      showCaret: false,
    },
    { divider: true },
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
    {
      icon: <FaDatabase style={{ fontSize: "1.25rem", margin: "0 auto" }} />,
      label: "Profile Database",
      action: () => navigate("/database"),
      active: location.pathname === "/database",
    },
    { divider: true },
    {
      icon: <HiIdentification style={{ fontSize: "1.5rem" }} />,
      label: "Profiles",
      action: () => openSidebar(DrawerTypes.PROFILE_SEARCH),
      active: false,
    },
    {
      icon: <AutoAwesome />,
      label: "Special rules & Magic",
      action: () => openSidebar(DrawerTypes.KEYWORD_SEARCH),
      active: false,
    },
    {
      icon: <GiSwordsEmblem style={{ fontSize: "1.5rem" }} />,
      label: "Charts",
      action: () => {},
      active: false,
      children: chartMenuItems,
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
      icon: <FaDiscord style={{ fontSize: "1.5rem" }} />,
      label: "MLB Discord",
      action: () => window.open(DISCORD_LINK, "_blank"),
      active: false,
    },
    {
      icon: <FaPatreon />,
      label: "Support us on Patreon",
      action: () => window.open(PATREON_LINK, "_blank"),
      active: false,
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
};
