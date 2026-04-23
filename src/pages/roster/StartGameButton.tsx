import Button from "@mui/material/Button";
import { FaChessRook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/cloud-sync/useApi.ts";
import { useGameModeState } from "../../state/gamemode";
import { Roster as RosterType } from "../../types/roster.ts";

export const StartGameButton = ({ roster }: { roster: RosterType }) => {
  const api = useApi();
  const navigate = useNavigate();

  const [startNewGame, hasStartedGame] = useGameModeState((state) => [
    state.startNewGame,
    state.gameState[roster.id],
  ]);

  return (
    <Button
      color="primary"
      variant="contained"
      aria-label="open drawer"
      onClick={() => {
        if (!hasStartedGame) {
          const game = startNewGame(roster);
          api.createGamestate(roster.id, game);
        }
        navigate(`/gamemode/${roster.id}`);
      }}
      startIcon={<FaChessRook />}
      sx={{
        whiteSpace: "nowrap", // Prevent text from wrapping
        minWidth: "20ch",
      }}
    >
      {hasStartedGame ? "Continue" : "Start"} Game
    </Button>
  );
};
