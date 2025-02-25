import { AlertColor } from "@mui/material";
import { Fragment, ReactNode } from "react";
import { DownloadFailed } from "./alerts/DownloadFailed.tsx";
import { ExportAlert } from "./alerts/ExportAlert.tsx";
import { ExportHistoryAlert } from "./alerts/ExportHistoryAlert.tsx";
import { ScreenshotCopiedAlert } from "./alerts/ScreenshotCopiedAlert.tsx";

export enum AlertTypes {
  EXPORT_ALERT = "EXPORT_ALERT",
  EXPORT_HISTORY_ALERT = "EXPORT_HISTORY_ALERT",
  RECORD_MATCH_SUCCESS = "RECORD_MATCH_SUCCESS",
  SCREENSHOT_COPIED_ALERT = "SCREENSHOT_COPIED_ALERT",
  DOWNLOAD_FAILED = "DOWNLOAD_FAILED",

  DELETE_UNIT_SUCCESS = "DELETE_UNIT_SUCCESS",
  DELETE_WARBAND_SUCCESS = "DELETE_WARBAND_SUCCESS",
  EMPTY_WARBAND_SUCCESS = "EMPTY_WARBAND_SUCCESS",
  DELETE_ARMY_LIST_SUCCESS = "DELETE_ARMY_LIST_SUCCESS",

  DUPLICATE_UNIT_SUCCESS = "DUPLICATE_UNIT_SUCCESS",
  DUPLICATE_WARBAND_SUCCESS = "DUPLICATE_WARBAND_SUCCESS",

  UPDATE_GROUP_SUCCES = "UPDATE_GROUP_SUCCES",
  DISBAND_GROUP_SUCCES = "DISBAND_GROUP_SUCCES",
  DISBAND_GROUP_FAILED = "DISBAND_GROUP_FAILED",
  DELETE_GROUP_SUCCES = "DELETE_GROUP_SUCCES",
  DELETE_GROUP_FAILED = "DELETE_GROUP_FAILED",

  IMPORT_COLLECTION_COMPLETED = "IMPORT_COLLECTION_COMPLETED",
  IMPORT_COLLECTION_ERROR = "IMPORT_COLLECTION_ERROR",
}

type AlertOptions = {
  autoHideAfter?: number;
};

export type AlertProps = {
  variant: AlertColor;
  content: ReactNode;
  options?: AlertOptions;
};

export const alertMap = new Map<AlertTypes, AlertProps>([
  [
    AlertTypes.EXPORT_ALERT,
    {
      variant: "success",
      content: <ExportAlert />,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    AlertTypes.EXPORT_HISTORY_ALERT,
    {
      variant: "success",
      content: <ExportHistoryAlert />,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    AlertTypes.EXPORT_HISTORY_ALERT,
    {
      variant: "success",
      content: (
        <Fragment>
          <b>Success!</b>
          <p>
            The match was successfully saved and can now be viewed & edited via
            the Match History page.
          </p>
        </Fragment>
      ),
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    AlertTypes.SCREENSHOT_COPIED_ALERT,
    {
      variant: "success",
      content: <ScreenshotCopiedAlert />,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    AlertTypes.DOWNLOAD_FAILED,
    {
      variant: "error",
      content: <DownloadFailed />,
      options: {
        // autoHideAfter: 5000,
      },
    },
  ],
  [
    AlertTypes.DELETE_UNIT_SUCCESS,
    {
      variant: "success",
      content: (
        <Fragment>
          <b>Successfully deleted</b>
          <p>Unit was successfully deleted from the warband.</p>
        </Fragment>
      ),
      options: {
        autoHideAfter: 2400,
      },
    },
  ],
  [
    AlertTypes.DELETE_WARBAND_SUCCESS,
    {
      variant: "success",
      content: (
        <Fragment>
          <b>Successfully deleted</b>
          <p>The warband was successfully deleted.</p>
        </Fragment>
      ),
      options: {
        autoHideAfter: 2400,
      },
    },
  ],
  [
    AlertTypes.EMPTY_WARBAND_SUCCESS,
    {
      variant: "success",
      content: (
        <Fragment>
          <b>Successfully reset</b>
          <p>The warband was successfully emptied and can now be rebuilt.</p>
        </Fragment>
      ),
      options: {
        autoHideAfter: 2400,
      },
    },
  ],
  [
    AlertTypes.DUPLICATE_UNIT_SUCCESS,
    {
      variant: "success",
      content: (
        <Fragment>
          <b>Successfully duplicated</b>
          <p>
            The unit was successfully duplicated and is added to the warband.
          </p>
        </Fragment>
      ),
      options: {
        autoHideAfter: 2400,
      },
    },
  ],
  [
    AlertTypes.DUPLICATE_WARBAND_SUCCESS,
    {
      variant: "success",
      content: (
        <Fragment>
          <b>Successfully duplicated</b>
          <p>
            The warband was successfully duplicated and is added to the roster.
          </p>
        </Fragment>
      ),
      options: {
        autoHideAfter: 2400,
      },
    },
  ],
  [
    AlertTypes.DELETE_ARMY_LIST_SUCCESS,
    {
      variant: "success",
      content: (
        <Fragment>
          <b>Successfully deleted</b>
          <p>Your roster was successfully deleted.</p>
        </Fragment>
      ),
      options: {
        autoHideAfter: 2400,
      },
    },
  ],
  [
    AlertTypes.DELETE_GROUP_SUCCES,
    {
      variant: "success",
      content: (
        <Fragment>
          <b>Successfully deleted</b>
          <p>Your group was successfully deleted.</p>
        </Fragment>
      ),
      options: {
        autoHideAfter: 2400,
      },
    },
  ],
  [
    AlertTypes.DELETE_GROUP_FAILED,
    {
      variant: "error",
      content: (
        <Fragment>
          <b>Failed to delete</b>
          <p>
            The group could not be deleted, please refresh the page and try
            again.
          </p>
        </Fragment>
      ),
    },
  ],
  [
    AlertTypes.DISBAND_GROUP_SUCCES,
    {
      variant: "success",
      content: (
        <Fragment>
          <b>Successfully disbanded</b>
          <p>Your group was successfully disbanded.</p>
        </Fragment>
      ),
      options: {
        autoHideAfter: 2400,
      },
    },
  ],
  [
    AlertTypes.DISBAND_GROUP_FAILED,
    {
      variant: "error",
      content: (
        <Fragment>
          <b>Failed to disbanded</b>
          <p>
            The group could not be disbanded, please refresh the page and try
            again.
          </p>
        </Fragment>
      ),
    },
  ],
  [
    AlertTypes.UPDATE_GROUP_SUCCES,
    {
      variant: "success",
      content: (
        <Fragment>
          <b>Successfully updated</b>
          <p>Your group was successfully updated.</p>
        </Fragment>
      ),
      options: {
        autoHideAfter: 2400,
      },
    },
  ],
  [
    AlertTypes.IMPORT_COLLECTION_COMPLETED,
    {
      variant: "success",
      content: (
        <Fragment>
          <b>Successfully imported</b>
          <p>The JSON-data was successfully imported into your collection.</p>
        </Fragment>
      ),
      options: {
        autoHideAfter: 2400,
      },
    },
  ],
  [
    AlertTypes.IMPORT_COLLECTION_ERROR,
    {
      variant: "error",
      content: (
        <Fragment>
          <b>Import incorrect</b>
          <p>
            The imported JSON was incorrectly formatted. Please reexport the
            data and try again.
          </p>
        </Fragment>
      ),
    },
  ],
]);
