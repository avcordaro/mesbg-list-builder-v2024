import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Button, ButtonGroup, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { FaSkullCrossbones } from "react-icons/fa";
import { GiCrackedShield } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { armyListData } from "../../../assets/data.ts";
import { SquareIconButton } from "../../../components/common/icon-button/SquareIconButton.tsx";
import { ModalTypes } from "../../../components/modal/modals.tsx";
import { useRosterInformation } from "../../../hooks/useRosterInformation.ts";
import { useScreenSize } from "../../../hooks/useScreenSize.ts";
import { useAppState } from "../../../state/app";
import { useGameModeState } from "../../../state/gamemode";

export const GamemodeToolbar = () => {
  const navigate = useNavigate();
  const screen = useScreenSize();
  const { setCurrentModal } = useAppState();
  const { gameState, updateGameState } = useGameModeState();
  const { roster, getAdjustedMetaData } = useRosterInformation();

  const game = gameState[roster.id];
  const metadata = game.rosterMetadata || getAdjustedMetaData(roster);

  const openEndGameDialog = () => {
    const gameStartTime = new Date(game.started);
    const gameEndTime = new Date();
    const gameDuration = gameEndTime.getTime() - gameStartTime.getTime();
    setCurrentModal(ModalTypes.CREATE_GAME_RESULT, {
      mode: "record",
      gameId: roster.id,
      formValues: {
        gameDate: new Date().toISOString().slice(0, 10),
        duration: Math.ceil(gameDuration / 60000),
        points: Math.ceil(roster.metadata.points / 50) * 50, // rounds to the nearest full 50.
        result: "Won",
        scenarioPlayed: null,
        tags: [],
        armies: roster.armyList,
        bows: metadata.bows as unknown as number,
        throwingWeapons: metadata.throwingWeapons as unknown as number,
        victoryPoints: "" as unknown as number,
        opponentArmies: "",
        opponentName: "",
        opponentVictoryPoints: "" as unknown as number,
      },
    });
  };

  const updateCasualties = (update: 1 | -1) => {
    updateGameState(roster.id, {
      casualties: game.casualties + update,
    });
  };

  const armyListMetadata = armyListData[roster.armyList];
  const breakPointDead =
    metadata.units > 0
      ? Math.floor(metadata.units * (armyListMetadata.break_point ?? 0.5)) + 1
      : 0;
  const quarter = metadata.units - Math.floor(metadata.units * 0.25);
  const casualties = game.casualties + game.heroCasualties;

  return screen.isMobile ? (
    <>
      <Stack direction="row" justifyContent="space-between" sx={{ my: 2 }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ChevronLeft />}
          onClick={() => {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate("/gamemode/start", { replace: true }); // the current entry in the history stack will be replaced with the new one with { replace: true }
            }
          }}
        >
          Back
        </Button>
        <Button variant="outlined" onClick={() => openEndGameDialog()}>
          End game
        </Button>
      </Stack>
      <Stack direction="row" justifyContent="space-around" sx={{ m: 2 }}>
        <Typography
          color={breakPointDead - casualties <= 0 ? "error" : "inherit"}
        >
          Until Broken:{" "}
          <b>
            {breakPointDead - casualties > 0 ? (
              breakPointDead - casualties
            ) : (
              <GiCrackedShield />
            )}
          </b>
        </Typography>
        <Typography color={quarter - casualties <= 0 ? "error" : "inherit"}>
          Until Quartered:{" "}
          <b>
            {quarter - casualties > 0 ? (
              quarter - casualties
            ) : (
              <FaSkullCrossbones />
            )}
          </b>
        </Typography>
      </Stack>
      <Stack direction="row" gap={2} justifyContent="center">
        <Typography variant="h6" className="middle-earth">
          Casualties:
        </Typography>
        <SquareIconButton
          onClick={() => updateCasualties(-1)}
          icon={<ChevronLeft />}
          iconColor="white"
          backgroundColor="darkgrey"
          iconPadding=".3rem"
          disabled={game.casualties === 0}
        />
        <Typography
          variant="h6"
          sx={{ mx: 1, fontSize: "1.4rem", fontWeight: "bolder" }}
        >
          {casualties}
        </Typography>
        <SquareIconButton
          onClick={() => updateCasualties(+1)}
          icon={<ChevronRight />}
          iconColor="white"
          backgroundColor="darkgrey"
          iconPadding=".3rem"
        />
      </Stack>
    </>
  ) : (
    <Toolbar
      sx={{
        backgroundColor: "rgba(211,211,211,0.5)",
        mb: 2,
        justifyContent: "space-between",
      }}
    >
      <Box>
        <ButtonGroup>
          <Button
            startIcon={<ChevronLeft />}
            onClick={() => {
              if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
              } else {
                navigate("/gamemode/start", { replace: true }); // the current entry in the history stack will be replaced with the new one with { replace: true }
              }
            }}
          >
            Back
          </Button>
          <Button onClick={() => openEndGameDialog()}>End game</Button>
        </ButtonGroup>
      </Box>
      <Stack direction="row" gap={2}>
        <Typography variant="h6" className="middle-earth">
          Casualties:
        </Typography>
        <SquareIconButton
          onClick={() => updateCasualties(-1)}
          icon={<ChevronLeft />}
          iconColor="white"
          backgroundColor="darkgrey"
          iconPadding=".3rem"
          disabled={game.casualties === 0}
        />
        <Typography
          variant="h6"
          sx={{ mx: 1, fontSize: "1.4rem", fontWeight: "bolder" }}
        >
          {casualties}
        </Typography>
        <SquareIconButton
          onClick={() => updateCasualties(+1)}
          icon={<ChevronRight />}
          iconColor="white"
          backgroundColor="darkgrey"
          iconPadding=".3rem"
        />
      </Stack>
      <Box>
        <Typography
          sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
          color={breakPointDead - casualties <= 0 ? "error" : "inherit"}
        >
          Until Broken:{" "}
          <b>
            {breakPointDead - casualties > 0 ? (
              breakPointDead - casualties
            ) : (
              <GiCrackedShield />
            )}
          </b>
        </Typography>
        <Typography
          sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
          color={quarter - casualties <= 0 ? "error" : "inherit"}
        >
          Until Quartered:{" "}
          <b>
            {quarter - casualties > 0 ? (
              quarter - casualties
            ) : (
              <FaSkullCrossbones />
            )}
          </b>
        </Typography>
      </Box>
    </Toolbar>
  );
};
