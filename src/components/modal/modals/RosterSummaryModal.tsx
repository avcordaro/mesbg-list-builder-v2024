import { Share } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";
import { FaClipboard, FaImage } from "react-icons/fa6";
import { useAppState } from "../../../state/app";
import { useUserPreferences } from "../../../state/preference";
import { CustomSwitch as Switch } from "../../atoms/switch/CustomSwitch.tsx";
import {
  ImageView,
  ImageViewViewHandlers,
} from "../../common/roster-summary/ImageView.tsx";
import {
  RosterTableView,
  RosterTableViewHandlers,
} from "../../common/roster-summary/TableView.tsx";
import {
  RosterTextView,
  RosterTextViewHandlers,
} from "../../common/roster-summary/TextView.tsx";

export const RosterSummaryModal = () => {
  const {
    closeModal,
    modalContext: { roster, withArmyName = false },
  } = useAppState();
  const { preferences } = useUserPreferences();
  const rosterTextRef = useRef<RosterTextViewHandlers>();
  const rosterTableRef = useRef<RosterTableViewHandlers>();
  const rosterImageViewRef = useRef<ImageViewViewHandlers>();

  const [plainTextView, setPlainTextView] = useState(false);
  const [showArmyBonus, setShowArmyBonus] = useState(false);
  const [showUnitTotals, setShowUnitTotals] = useState(false);
  const [includeRosterName, setIncludeRosterName] = useState(
    withArmyName && roster.name !== roster.armyList,
  );

  const handleTotalsToggle = () => setShowUnitTotals(!showUnitTotals);
  const handlePlainTextToggle = () => setPlainTextView(!plainTextView);
  const handleBonusToggle = () => setShowArmyBonus(!showArmyBonus);
  const handleRosterNameToggle = () => setIncludeRosterName(!includeRosterName);

  return (
    <>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexGrow: 1,
            }}
            className="middle-earth"
          >
            <Share /> Roster Summary & Sharing
          </Typography>
          <Box sx={{ px: 1 }}>
            {plainTextView ? (
              <Button
                variant="contained"
                startIcon={<FaClipboard />}
                onClick={() => {
                  rosterTextRef.current.copyToClipboard();
                }}
              >
                Copy to clipboard
              </Button>
            ) : preferences.oldShareScreen ? (
              <Button
                variant="contained"
                startIcon={<FaImage />}
                onClick={() => {
                  rosterTableRef.current.createScreenshot();
                }}
              >
                Create pretty image
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<FaImage />}
                onClick={() => {
                  rosterImageViewRef.current.createScreenshot();
                }}
              >
                Convert to image
              </Button>
            )}
          </Box>

          <IconButton
            onClick={() => closeModal()}
            sx={{ ml: "auto" }}
            data-test-id="dialog--close-button"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {plainTextView ? (
          <RosterTextView
            roster={roster}
            showArmyBonus={showArmyBonus}
            showUnitTotals={showUnitTotals}
            ref={rosterTextRef}
          />
        ) : preferences.oldShareScreen ? (
          <RosterTableView
            roster={roster}
            showArmyBonus={showArmyBonus}
            showUnitTotals={showUnitTotals}
            includeRosterName={includeRosterName}
            ref={rosterTableRef}
          />
        ) : (
          <ImageView
            roster={roster}
            showArmyBonus={showArmyBonus}
            showUnitTotals={showUnitTotals}
            includeRosterName={includeRosterName}
            ref={rosterImageViewRef}
          />
        )}
      </DialogContent>
      <Divider />
      <DialogActions>
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            px: 2,
          }}
        >
          <FormControlLabel
            checked={plainTextView}
            control={<Switch color="primary" />}
            label="Plain text"
            labelPlacement="end"
            onChange={handlePlainTextToggle}
          />
          <FormControlLabel
            checked={showUnitTotals}
            control={<Switch color="primary" />}
            label="Show unit totals"
            labelPlacement="end"
            onChange={handleTotalsToggle}
          />
          <FormControlLabel
            checked={showArmyBonus}
            control={<Switch color="primary" />}
            label="Show army bonus"
            labelPlacement="end"
            onChange={handleBonusToggle}
          />
          <FormControlLabel
            checked={includeRosterName}
            control={<Switch color="primary" />}
            label="Display roster name"
            labelPlacement="end"
            onChange={handleRosterNameToggle}
          />
        </FormGroup>
      </DialogActions>
    </>
  );
};
