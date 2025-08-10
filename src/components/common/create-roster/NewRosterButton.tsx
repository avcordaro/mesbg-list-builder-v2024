import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import fallbackLogo from "../../../assets/images/default.png";
import { useScreenSize } from "../../../hooks/useScreenSize.ts";
import { useAppState } from "../../../state/app";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { ModalTypes } from "../../modal/modals.tsx";
import { CARD_SIZE_IN_PX } from "../roster-card/RosterSummaryCard.tsx";

export const NewRosterButton: FunctionComponent = () => {
  const { setCurrentModal } = useAppState();
  const { mode } = useThemeContext();
  const screen = useScreenSize();

  function openCreateRosterModal() {
    console.debug("Open create roster modal.");
    setCurrentModal(ModalTypes.CREATE_NEW_ROSTER);
  }

  return screen.isMobile ? (
    <Fab
      sx={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
      }}
      onClick={() => openCreateRosterModal()}
      color="primary"
    >
      <AddIcon />
    </Fab>
  ) : (
    <Card
      sx={{
        p: 2,
        width: `${CARD_SIZE_IN_PX}px`,
        aspectRatio: "1/1",
        cursor: "pointer",
      }}
      elevation={4}
      onClick={() => openCreateRosterModal()}
      data-test-id="rosters--create-a-roster--button"
    >
      <Stack
        sx={{ height: "100%" }}
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <Avatar
          alt="default faction logo"
          src={fallbackLogo}
          sx={{
            width: 150,
            height: 150,
            mb: 2,
            display: "inline-block",
            backgroundColor: "transparent",
            "& .MuiAvatar-img": {
              filter: mode === "dark" ? "brightness(0) invert(1)" : "",
            },
          }}
        />
        <Typography
          variant="h6"
          className="middle-earth"
          sx={{
            whiteSpace: "nowrap", // Prevent text from wrapping
            overflow: "hidden", // Hide the overflowing text
            textOverflow: "ellipsis", // Show ellipsis when text overflows
            width: "240px", // Set a fixed width or max-width for overflow
          }}
        >
          Create or Import
          <br />
          New Roster
        </Typography>
      </Stack>
    </Card>
  );
};
