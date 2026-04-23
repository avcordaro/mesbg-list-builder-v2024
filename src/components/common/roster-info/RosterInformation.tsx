import { Close, Delete, Refresh } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Collapse,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { FunctionComponent } from "react";
import { BiPencil } from "react-icons/bi";
import { armyListData } from "../../../assets/data.ts";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { useRosterSync } from "../../../hooks/cloud-sync/RosterCloudSyncProvider";
import { useUpdateRosterVersion } from "../../../hooks/mutations/useUpdateRosterVersion.ts";
import { useAppState } from "../../../state/app";
import { Roster } from "../../../types/roster.ts";
import { ModalTypes } from "../../modal/modals.tsx";
import { AdditionalRules } from "./sections/AdditionalRules.tsx";
import { RosterOverview } from "./sections/RosterOverview.tsx";
import { SpecialRules } from "./sections/SpecialRules.tsx";
import { Warnings } from "./sections/Warnings.tsx";

export type RosterInformationProps = {
  roster: Roster;
  onClose: () => void;
  editable?: boolean;
};

export const RosterInformation: FunctionComponent<RosterInformationProps> = (
  props,
) => {
  const { palette } = useTheme();
  const { setCurrentModal } = useAppState();
  const { isOutdatedRoster, updateRoster } = useUpdateRosterVersion();
  const { syncPending, syncNow } = useRosterSync();
  const screen = useScreenSize();
  return (
    <Stack gap={2} sx={{ p: 2 }}>
      <Box>
        <Stack
          direction={screen.isDesktop ? "row" : "row-reverse"}
          justifyContent="space-between"
          flexWrap="wrap"
        >
          {screen.isDesktop ? (
            <></>
          ) : (
            <IconButton onClick={props.onClose}>
              <Close />
            </IconButton>
          )}
          <Box sx={{ textWrap: "wrap" }}>
            <Typography variant="h5" className="middle-earth">
              {props.roster.name}
            </Typography>
          </Box>
        </Stack>
        <Typography
          variant="subtitle1"
          className="middle-earth"
          sx={{
            color: ({ palette }) => palette.text.secondary,
          }}
        >
          <small>{props.roster.armyList}</small>{" "}
          {!!armyListData[props.roster.armyList]?.legacy && (
            <Typography
              className="middle-earth"
              variant="subtitle2"
              component="small"
              sx={{
                fontStyle: "italic",
              }}
            >
              (Legacy)
            </Typography>
          )}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            mt: -0.5,
            color: ({ palette }) => palette.text.secondary,
            visibility: isOutdatedRoster() ? "visible" : "hidden",
          }}
        >
          <small>
            <sub>
              Built in v{props.roster.version}, current version {BUILD_VERSION}{" "}
              <span
                style={{
                  marginLeft: "8px",
                  display: "inline-flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    updateRoster();
                  }}
                  style={{
                    display: "inline-flex",
                    flexDirection: "row",
                    alignItems: "center",
                    color: palette.primary.main,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  <Refresh sx={{ fontSize: "12px" }} />
                  Update
                </a>
                )
              </span>
            </sub>
          </small>
        </Typography>
      </Box>

      {props.editable && (
        <ButtonGroup fullWidth size="small">
          <Button
            endIcon={<BiPencil />}
            sx={{ flexGrow: 1 }}
            onClick={() =>
              setCurrentModal(ModalTypes.EDIT_ROSTER_NAME, {
                roster: props.roster,
              })
            }
            data-test-id="edit-roster-name"
          >
            Edit Roster
          </Button>
          <Tooltip title="delete roster">
            <Button
              color="error"
              sx={{
                width: "auto",
                py: 1,
                px: 2,
              }}
              onClick={() =>
                setCurrentModal(ModalTypes.CONFIRM_DELETE_ROSTER, {
                  roster: props.roster,
                })
              }
              data-test-id="delete-roster"
            >
              <Delete />
            </Button>
          </Tooltip>
        </ButtonGroup>
      )}
      <Collapse in={syncPending} sx={{ width: "100%" }}>
        <Button
          variant="outlined"
          color="success"
          fullWidth
          onClick={(e) => syncNow(e)}
        >
          Sync to account
        </Button>
      </Collapse>

      <Warnings />
      <RosterOverview {...props} />
      <AdditionalRules {...props} />
      <SpecialRules {...props} />
    </Stack>
  );
};
