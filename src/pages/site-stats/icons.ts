import { CgPlayListAdd } from "react-icons/cg";
import { FaTrophy, FaUserGroup } from "react-icons/fa6";
import { GiPerspectiveDiceSixFacesOne, GiRollingDices } from "react-icons/gi";
import { MdGroupAdd, MdGroups2, MdLibraryBooks } from "react-icons/md";

export const statsIconMap = {
  new_users_last_7_days: MdGroupAdd,
  active_users_last_7_days: FaUserGroup,
  rosters_created_last_7_days: CgPlayListAdd,
  active_games_last_7_days: GiPerspectiveDiceSixFacesOne,
  games_last_7_days: FaTrophy,
  total_rosters: MdLibraryBooks,
  total_games: GiRollingDices,
  total_users: MdGroups2,
} as const;
