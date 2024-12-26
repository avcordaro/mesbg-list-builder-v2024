import { Button, DialogActions, DialogContent } from "@mui/material";
import Box from "@mui/material/Box";
import { useRef } from "react";
import { useAppState } from "../../../state/app";
import { useGameModeState } from "../../../state/gamemode";
import {
  GameResultsForm,
  GameResultsFormHandlers,
} from "../../common/game-results-form/GameResultsForm.tsx";

export const CreateGameResultModal = () => {
  const { closeModal, modalContext } = useAppState();
  const { endGame } = useGameModeState();
  const childRef = useRef<GameResultsFormHandlers>(null);

  const saveGameToState = () => {
    if (childRef.current) {
      if (childRef.current.saveToState()) {
        closeModal();
      }
    }

    if (modalContext.gameId) {
      endGame(modalContext.gameId);
    }
  };

  const closeModalAndGame = () => {
    if (modalContext.gameId) {
      endGame(modalContext.gameId);
      closeModal();
    }
  };

  return (
    <>
      <DialogContent>
        <GameResultsForm ref={childRef} />
      </DialogContent>
      <DialogActions>
        {!!modalContext.gameId && (
          <Button
            variant="outlined"
            color="error"
            onClick={closeModalAndGame}
            sx={{ minWidth: "20ch" }}
            data-test-id="dialog--cancel-button"
          >
            End game without saving
          </Button>
        )}
        <Box flexGrow={1} />
        <Button
          variant="text"
          color="inherit"
          onClick={closeModal}
          sx={{ minWidth: "20ch" }}
          data-test-id="dialog--cancel-button"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={saveGameToState}
          sx={{ minWidth: "20ch" }}
          data-test-id="dialog--submit-button"
        >
          {modalContext.mode} game
        </Button>
      </DialogActions>
    </>
  );
};
