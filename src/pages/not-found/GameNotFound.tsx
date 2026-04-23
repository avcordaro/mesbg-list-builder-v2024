import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import brokenSword from "../../assets/images/broken-sword.png";
import { useGameModeState } from "../../state/gamemode";
import { Roster } from "../../types/roster.ts";
import { DISCORD_LINK } from "../home/Home.tsx";

interface GamestateNotFoundProps {
  roster: Roster;
}

export const GamestateNotFound = ({ roster }: GamestateNotFoundProps) => {
  const navigate = useNavigate();
  const startGame = useGameModeState((state) => state.startNewGame);

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        gap: 2,
        p: 2,
        my: 4,
      }}
    >
      <Typography variant="h4" className="middle-earth">
        Game not found!
      </Typography>
      <img
        alt="Image of a broken sword"
        src={brokenSword}
        style={{ width: "300px", margin: "auto" }}
      />
      <Typography component="blockquote">
        &quot;No songs are sung of this company... yet.&quot;
      </Typography>
      <Typography sx={{ mb: 2 }}>
        The road lies before you, untrodden and full of peril. <br /> To write
        the tale of this roster, you must first take the first step upon the
        path.
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          p: 1,
        }}
      >
        <Stack gap={2}>
          <Button color="inherit" fullWidth onClick={() => startGame(roster)}>
            Start a new game for {roster.name}
          </Button>
          <Button
            color="inherit"
            fullWidth
            onClick={() => navigate(`/roster/${roster.id}`)}
          >
            Head back to the roster builder
          </Button>
          <Button color="inherit" fullWidth onClick={() => navigate("/")}>
            Return to the homepage
          </Button>
          <Button
            color="inherit"
            fullWidth
            onClick={() => window.open(DISCORD_LINK)}
          >
            Ask for support
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};
