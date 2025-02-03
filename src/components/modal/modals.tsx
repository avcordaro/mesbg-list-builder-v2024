import {
  BookmarkAdd,
  Delete,
  DeleteForever,
  Download,
  Edit,
  LibraryAdd,
  UploadFile,
} from "@mui/icons-material";
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
import { AddToCollection } from "./modals/AddToCollection.tsx";
import { ChartsModal } from "./modals/ChartsModal.tsx";
import { ConfirmDeleteGroupModal } from "./modals/ConfirmDeleteGroupModal.tsx";
import { ConfirmDeleteRosterModal } from "./modals/ConfirmDeleteRosterModal.tsx";
import { ConfirmDisbandGroupModal } from "./modals/ConfirmDisbandGroupModal.tsx";
import { CreateGameResultModal } from "./modals/CreateGameResultModal.tsx";
import { CreateNewRosterGroupModal } from "./modals/CreateNewRosterGroupModal.tsx";
import { CreateNewRosterModal } from "./modals/CreateNewRosterModal.tsx";
import { DownloadProfileCardModal } from "./modals/DownloadProfileCardModal.tsx";
import { EditRosterModal } from "./modals/EditRosterModal.tsx";
import { EndGameStepperDialog } from "./modals/EndGameStepperDialog.tsx";
import { ExportCollection } from "./modals/ExportCollection.tsx";
import { ExportHistoryModal } from "./modals/ExportHistoryModal.tsx";
import { ExportRosterModal } from "./modals/ExportRosterModal.tsx";
import { ImportCollection } from "./modals/ImportCollection.tsx";
import { ImportGameHistoryModal } from "./modals/ImportHistoryModal.tsx";
import { ProfileCardModal } from "./modals/ProfileCardModal.tsx";
import { RosterSummaryModal } from "./modals/RosterSummaryModal.tsx";
import { RosterSummaryScreenshotModal } from "./modals/RosterSummaryScreenshotModal.tsx";
import { UpdateGroupModal } from "./modals/UpdateGroupModal.tsx";

export enum ModalTypes {
  CREATE_NEW_ROSTER = "CREATE_NEW_ROSTER",
  EXPORT_ROSTER = "EXPORT_ROSTER",

  PROFILE_CARD = "PROFILE_CARD",
  CHART = "CHART",

  EXPORT_GAMES = "EXPORT_GAMES",
  IMPORT_GAMES = "IMPORT_GAMES",
  CREATE_GAME_RESULT = "CREATE_GAME_RESULT",
  END_GAME_DIALOG = "END_GAME_DIALOG",

  DOWNLOAD_PROFILE_CARDS = "DOWNLOAD_PROFILE_CARDS",
  ROSTER_SUMMARY = "ROSTER_SUMMARY",
  ROSTER_SCREENSHOT = "ROSTER_SCREENSHOT",

  CONFIRM_DELETE_ROSTER = "CONFIRM_DELETE_ROSTER",
  EDIT_ROSTER_NAME = "EDIT_ROSTER_NAME",
  CREATE_ROSTER_GROUP = "CREATE_ROSTER_GROUP",

  UPDATE_ROSTER_GROUP = "UPDATE_ROSTER_GROUP",
  DELETE_ROSTER_GROUP = "DELETE_ROSTER_GROUP",
  DISBAND_ROSTER_GROUP = "DISBAND_ROSTER_GROUP",

  ADD_TO_COLLECTION = "ADD_TO_COLLECTION",
  EXPORT_COLLECTION = "EXPORT_COLLECTION",
  IMPORT_COLLECTION = "IMPORT_COLLECTION",
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
    ModalTypes.END_GAME_DIALOG,
    {
      icon: <EmojiEventsIcon />,
      title: "End game",
      children: <EndGameStepperDialog />,
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
  [
    ModalTypes.UPDATE_ROSTER_GROUP,
    {
      icon: <Edit />,
      title: "Update Group",
      children: <UpdateGroupModal />,
      maxWidth: "md",
    },
  ],
  [
    ModalTypes.DISBAND_ROSTER_GROUP,
    {
      icon: <Delete />,
      title: "Disband Group",
      children: <ConfirmDisbandGroupModal />,
      maxWidth: "md",
    },
  ],
  [
    ModalTypes.DELETE_ROSTER_GROUP,
    {
      icon: <DeleteForever />,
      title: "Delete Group",
      children: <ConfirmDeleteGroupModal />,
      maxWidth: "md",
    },
  ],
  [
    ModalTypes.ADD_TO_COLLECTION,
    {
      icon: <BookmarkAdd />,
      children: <AddToCollection />,
      maxWidth: "lg",
    },
  ],
  [
    ModalTypes.EXPORT_COLLECTION,
    {
      icon: <SaveIcon />,
      title: "Export Collection",
      children: <ExportCollection />,
      maxWidth: "sm",
    },
  ],
  [
    ModalTypes.IMPORT_COLLECTION,
    {
      icon: <UploadFile />,
      title: "Import Collection",
      children: <ImportCollection />,
      maxWidth: "md",
    },
  ],
]);
