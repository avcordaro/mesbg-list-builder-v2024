import { DeleteForever, Download, Edit, LibraryAdd } from "@mui/icons-material";
import AddCircleOutline from "@mui/icons-material/AddCardOutlined";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SaveIcon from "@mui/icons-material/Save";
import { Breakpoint } from "@mui/material";
import { ReactNode } from "react";
import { BiExport } from "react-icons/bi";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FaFileImport } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { GiSwordsEmblem } from "react-icons/gi";
import { ChartsModal } from "./modals/ChartsModal.tsx";
import { ConfirmDeleteRosterModal } from "./modals/ConfirmDeleteRosterModal.tsx";
import { CreateGameResultModal } from "./modals/CreateGameResultModal.tsx";
import { CreateNewRosterGroupModal } from "./modals/CreateNewRosterGroupModal.tsx";
import { CreateNewRosterModal } from "./modals/CreateNewRosterModal.tsx";
import { DownloadProfileCardModal } from "./modals/DownloadProfileCardModal.tsx";
import { EditRosterModal } from "./modals/EditRosterModal.tsx";
import { ExportHistoryModal } from "./modals/ExportHistoryModal.tsx";
import { ExportRosterModal } from "./modals/ExportRosterModal.tsx";
import { ImportGameHistoryModal } from "./modals/ImportHistoryModal.tsx";
import { ProfileCardModal } from "./modals/ProfileCardModal.tsx";
import { RosterSummaryModal } from "./modals/RosterSummaryModal.tsx";
import { RosterSummaryScreenshotModal } from "./modals/RosterSummaryScreenshotModal.tsx";

export enum ModalTypes {
  CREATE_NEW_ROSTER = "CREATE_NEW_ROSTER",
  EXPORT_ROSTER = "EXPORT_ROSTER",

  PROFILE_CARD = "PROFILE_CARD",
  CHART = "CHART",

  EXPORT_GAMES = "EXPORT_GAMES",
  IMPORT_GAMES = "IMPORT_GAMES",
  CREATE_GAME_RESULT = "CREATE_GAME_RESULT",

  DOWNLOAD_PROFILE_CARDS = "DOWNLOAD_PROFILE_CARDS",
  ROSTER_SUMMARY = "ROSTER_SUMMARY",
  ROSTER_SCREENSHOT = "ROSTER_SCREENSHOT",

  CONFIRM_DELETE_ROSTER = "CONFIRM_DELETE_ROSTER",
  EDIT_ROSTER_NAME = "EDIT_ROSTER_NAME",
  CREATE_ROSTER_GROUP = "CREATE_ROSTER_GROUP",
}

export type ModalProps = {
  children: ReactNode;
  icon?: ReactNode;
  title?: string;
  customModalHeader?: boolean;
  overflow?: string;
  maxWidth?: Breakpoint;
};

export const modals = new Map<ModalTypes, ModalProps>([
  [
    ModalTypes.IMPORT_GAMES,
    {
      icon: <FaFileImport />,
      title: "Import game history",
      children: <ImportGameHistoryModal />,
      overflow: "none",
      maxWidth: "sm",
    },
  ],
  [
    ModalTypes.EXPORT_GAMES,
    {
      icon: <SaveIcon />,
      title: "Export history",
      children: <ExportHistoryModal />,
      overflow: "none",
      maxWidth: "md",
    },
  ],
  [
    ModalTypes.CREATE_GAME_RESULT,
    {
      icon: <EmojiEventsIcon />,
      title: "Game results",
      children: <CreateGameResultModal />,
    },
  ],
  [
    ModalTypes.CREATE_NEW_ROSTER,
    {
      icon: <AddCircleOutline />,
      title: "New Roster",
      children: <CreateNewRosterModal />,
      overflow: "none",
      maxWidth: "sm",
    },
  ],
  [
    ModalTypes.PROFILE_CARD,
    {
      icon: <BsFillPersonVcardFill />,
      title: "",
      children: <ProfileCardModal />,
    },
  ],
  [
    ModalTypes.CHART,
    {
      icon: <GiSwordsEmblem />,
      title: "",
      children: <ChartsModal />,
      overflow: "none",
    },
  ],
  [
    ModalTypes.DOWNLOAD_PROFILE_CARDS,
    {
      icon: <Download />,
      title: "Download all Profile Cards",
      children: <DownloadProfileCardModal />,
      overflow: "none",
    },
  ],
  [
    ModalTypes.CONFIRM_DELETE_ROSTER,
    {
      icon: <DeleteForever />,
      title: "Delete roster",
      children: <ConfirmDeleteRosterModal />,
      overflow: "none",
      maxWidth: "sm",
    },
  ],
  [
    ModalTypes.EDIT_ROSTER_NAME,
    {
      icon: <Edit />,
      title: "Update roster",
      children: <EditRosterModal />,
      overflow: "none",
      maxWidth: "sm",
    },
  ],
  [
    ModalTypes.EXPORT_ROSTER,
    {
      icon: <BiExport />,
      title: "Export Roster",
      children: <ExportRosterModal />,
      overflow: "none",
      maxWidth: "sm",
    },
  ],
  [
    ModalTypes.ROSTER_SUMMARY,
    {
      customModalHeader: true,
      children: <RosterSummaryModal />,
      maxWidth: "md",
    },
  ],
  [
    ModalTypes.ROSTER_SCREENSHOT,
    {
      icon: <FaImage />,
      title: "Screenshot",
      children: <RosterSummaryScreenshotModal />,
      maxWidth: "md",
    },
  ],
  [
    ModalTypes.CREATE_ROSTER_GROUP,
    {
      icon: <LibraryAdd />,
      title: "Create Group",
      children: <CreateNewRosterGroupModal />,
      maxWidth: "md",
    },
  ],
]);
