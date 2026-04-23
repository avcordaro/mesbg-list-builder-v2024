import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import brokenSword from "../../assets/images/broken-sword.png";
import { DISCORD_LINK } from "../home/Home.tsx";

export const GroupNotFound = () => {
  const navigate = useNavigate();

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
        Group not found!
      </Typography>
      <img
        alt="Image of a broken sword"
        src={brokenSword}
        style={{ width: "300px", margin: "auto" }}
      />
      <Typography sx={{ mb: 2 }}>
        &quot;The group you sought has passed into shadow.
        <br />
        Its voices are silent, its tale untold, and its road forever
        untraveled.&quot;
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
          <Button
            color="inherit"
            fullWidth
            onClick={() => navigate("/rosters")}
          >
            Return the your rosters.
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
