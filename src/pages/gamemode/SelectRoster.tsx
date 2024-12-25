import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export const SelectRoster = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        p: 2,
      }}
    >
      <Typography variant="h4" className="middle-earth">
        Gamemode
      </Typography>

      <Typography variant="body1">
        Select a roster below to start a game
      </Typography>
    </Container>
  );
};
