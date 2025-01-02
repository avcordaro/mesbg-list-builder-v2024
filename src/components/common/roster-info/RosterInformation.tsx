import { Close, Delete } from "@mui/icons-material";
import { Button, IconButton, ButtonGroup, Stack, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { BiPencil } from "react-icons/bi";
import { useScreenSize } from "../../../hooks/useScreenSize.ts";
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
  const { setCurrentModal } = useAppState();
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
          <small>
            <i>{props.roster.armyList}</i>
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
            Edit name
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

      <Warnings />
      <RosterOverview {...props} />
      <AdditionalRules {...props} />
      <SpecialRules {...props} />
    </Stack>
  );
};
