import { Add, UploadFile } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { useEffect, useRef, useState } from "react";
import { CustomAlert } from "../../components/atoms/alert/CustomAlert.tsx";
import { ModalTypes } from "../../components/modal/modals.tsx";
import { useAppState } from "../../state/app";
import { useRecentGamesState } from "../../state/recent-games";
import { PastGame } from "../../state/recent-games/history";
import { useThemeContext } from "../../theme/ThemeContext.tsx";
import { Charts } from "./components/Charts.tsx";
import { FilterForm, Filters } from "./components/FilterForm.tsx";
import { GamesTable } from "./components/GamesTable.tsx";

export const SavedGameResults = () => {
  const { recentGames } = useRecentGamesState();
  const { setCurrentModal } = useAppState();
  const { mode } = useThemeContext();
  const [filteredGames, setFilteredGames] = useState(recentGames);
  const [fabOpen, setFabOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    army: "",
    scenario: "",
    opponent: "",
    opponentArmy: "",
    result: "",
    tag: "",
  });

  const speedDialRef = useRef<HTMLDivElement | null>(null);

  const actions = [
    {
      icon: <Add />,
      name: "Record a game",
      callback: () =>
        setCurrentModal(ModalTypes.CREATE_GAME_RESULT, {
          mode: "create",
          formValues: {
            gameDate: new Date().toISOString().slice(0, 10),
            duration: "",
            points: "", // rounds to the nearest full 50.
            result: "Won",
            scenarioPlayed: null,
            tags: [],
            armies: "",
            bows: "" as unknown as number,
            victoryPoints: "" as unknown as number,
            opponentArmies: "",
            opponentName: "",
            opponentVictoryPoints: "" as unknown as number,
          },
        }),
      disabled: false,
    },
    {
      icon: <SaveIcon />,
      name: "Export history",
      callback: () => setCurrentModal(ModalTypes.EXPORT_GAMES),
      disabled: recentGames.length === 0,
    },
    {
      icon: <UploadFile />,
      name: "Import history",
      callback: () => setCurrentModal(ModalTypes.IMPORT_GAMES),
      disabled: false,
    },
  ];

  function matchesFilter(game: PastGame, filters: Filters) {
    const matchesArmy = game.armies.includes(filters.army || "");
    const matchesOpponent =
      game.opponentName?.includes(filters.opponent || "") ?? true;
    const matchesOpponentArmy =
      game.opponentArmies?.includes(filters.opponentArmy || "") ?? true;
    const matchesResult = game.result.includes(filters.result || "");
    const matchesTag =
      !filters.tag || game.tags?.some((tag) => tag.includes(filters.tag || ""));
    const matchesScenario =
      game.scenarioPlayed?.includes(filters.scenario || "") ?? true;

    return (
      matchesArmy &&
      matchesOpponent &&
      matchesOpponentArmy &&
      matchesResult &&
      matchesTag &&
      matchesScenario
    );
  }

  const onFilterChanged = (filters: Filters) => {
    setFilters(filters);
  };

  useEffect(() => {
    setFilteredGames(
      recentGames.filter((game) => matchesFilter(game, filters)),
    );
  }, [filters, recentGames]);

  return (
    <Container sx={{ mt: 2, maxWidth: "calc(100vw - 3*24px)" }}>
      <Typography variant="h4" className="middle-earth" sx={{ mb: 2 }}>
        Match History
      </Typography>
      <Stack sx={{ py: 1 }} gap={3}>
        <FilterForm onChange={onFilterChanged} />
        {recentGames.length > 0 ? (
          <>
            {filteredGames.length > 0 ? (
              <>
                <GamesTable games={filteredGames} />
                <Charts games={filteredGames} />
              </>
            ) : (
              <CustomAlert severity="warning" title="">
                Your current filter combination resulted in 0 games. Please
                adjust the filters.
              </CustomAlert>
            )}
          </>
        ) : (
          <CustomAlert severity="info" title="">
            You have 0 games on record. Play a match using the{" "}
            <em>&quot;Game Mode&quot;</em> from the roster builder or{" "}
            <em>create/import</em> games using the Floating button in the bottom
            right.
          </CustomAlert>
        )}

        <Box ref={speedDialRef}>
          <SpeedDial
            ariaLabel="action-buttons"
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
            open={fabOpen}
            onClick={() => setFabOpen((x) => !x)}
            onClose={null}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                onClick={() => {
                  if (!action.disabled) action.callback();
                }}
                FabProps={{ disabled: action.disabled }}
                tooltipTitle={
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      color: mode === "dark" ? "white" : "inherit",
                    }}
                  >
                    {action.name}
                  </span>
                }
                tooltipOpen
              />
            ))}
          </SpeedDial>
        </Box>
      </Stack>
    </Container>
  );
};
