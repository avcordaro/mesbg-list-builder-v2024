import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { Game } from "../../../state/gamemode/gamestate";
import { useRosterBuildingState } from "../../../state/roster-building";

interface GameSwitcherProps {
  games: ({ roster: string } & Game)[];
  activeGame: string;
}

export const GameSwitcher = ({ games, activeGame }: GameSwitcherProps) => {
  const navigate = useNavigate();
  const screen = useScreenSize();
  const rosters = useRosterBuildingState((state) =>
    Object.fromEntries(
      state.rosters.map(({ id, name, armyList }) => [
        id,
        `${name} (${armyList})`,
      ]),
    ),
  );
  const [otherGames, setOtherGames] = useState(games);
  const [selectedGame, setSelectedGame] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedGame(event.target.value as string);
  };

  useEffect(() => {
    const otherGames = games.filter((game) => game.roster !== activeGame);
    setOtherGames(otherGames);
    setSelectedGame(otherGames.length === 0 ? "" : otherGames[0].roster);
  }, [activeGame, games]);

  if (games.length <= 1) {
    return null;
  }

  return (
    <Stack direction="row" gap={2} sx={{ mb: 1 }}>
      <FormControl size="small" fullWidth>
        <InputLabel id="gameswitcher">Switch to game...</InputLabel>
        <Select
          labelId="gameswitcher"
          id="gameswitcher-select"
          value={selectedGame}
          label="Switch to game..."
          onChange={handleChange}
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            maxWidth: screen.isMobile ? "24ch" : "unset",
          }}
        >
          {otherGames.map((game) => (
            <MenuItem key={game.roster} value={game.roster}>
              {rosters[game.roster]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        onClick={() => navigate(`/gamemode/${selectedGame}`)}
        sx={{ minWidth: "20ch" }}
        variant="outlined"
        color="inherit"
      >
        Switch
      </Button>
    </Stack>
  );
};
