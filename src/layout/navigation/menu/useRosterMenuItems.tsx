import { FolderOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { FactionIcon } from "../../../components/atoms/faction-icon/FactionIcon.tsx";
import { icons as groupIcons } from "../../../components/atoms/group-icon/icons.tsx";
import { useGameModeState } from "../../../state/gamemode";
import { useUserPreferences } from "../../../state/preference";
import { useRosterBuildingState } from "../../../state/roster-building";
import { RosterGroup } from "../../../state/roster-building/groups";
import { Roster } from "../../../types/roster.ts";
import { NavLink } from "./NavItemLink.tsx";

const buildTree =
  (
    currentPath: string,
    navigate: (to: string) => void,
    hideRosters: boolean,
    games: string[],
  ) =>
  (groups: RosterGroup[], rosters: Roster[]): NavLink[] => {
    const rootMenu: NavLink[] = [];
    const groupMap = new Map<string, NavLink>();

    // Convert groups to TreeNodes
    groups.forEach((group) => {
      groupMap.set(group.slug, {
        action: () => navigate(`/rosters/${group.slug}`),
        active: currentPath === `/rosters/${encodeURIComponent(group.slug)}`,
        icon: groupIcons[group.icon] || <FolderOutlined />,
        label: group.name,
        children: [],
      });
    });

    // Assign groups to their parents
    groups.forEach((group) => {
      const node = groupMap.get(group.slug)!;
      if (group.parent && groupMap.has(group.parent)) {
        groupMap.get(group.parent)!.children!.push(node);
        groupMap.get(group.parent)!.showCaret = true;
      } else {
        rootMenu.push(node);
      }
    });

    if (hideRosters) return rootMenu;

    // Add rosters to either their group or root
    rosters.forEach((roster) => {
      const rosterNode: NavLink = {
        action: () => navigate(`/roster/${roster.id}`),
        active: location.pathname === `/roster/${roster.id}`,
        icon: <FactionIcon faction={roster.armyList} />,
        label: roster.name,
        badge: games.includes(roster.id),
      };
      if (roster.group && groupMap.has(roster.group)) {
        groupMap.get(roster.group)!.children!.push(rosterNode);
        groupMap.get(roster.group)!.showCaret = true;
      } else {
        rootMenu.push(rosterNode);
      }
    });

    return rootMenu;
  };

export const useRosterMenuItems = () => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const { rosters, groups } = useRosterBuildingState();
  const rostersWithOngoingGame = useGameModeState((state) =>
    Object.keys(state.gameState),
  );

  return buildTree(
    location.pathname,
    navigate,
    preferences.hideRostersInNavigation,
    rostersWithOngoingGame,
  )(groups, rosters);
};
