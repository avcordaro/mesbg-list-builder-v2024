import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { download } from "../../hooks/export/useDownload.ts";

export const AppFallback = () => {
  const error = useRouteError();
  let errorMessage: string;
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.stack || error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }

  function getLocallyStoredDate() {
    const collection = JSON.parse(localStorage.getItem("mlb-collection"));
    const gamestate = JSON.parse(localStorage.getItem("mlb-gamestate"));
    const matches = JSON.parse(localStorage.getItem("mlb-matches"));
    const rosters = JSON.parse(localStorage.getItem("mlb-rosters"));
    const preferences = JSON.parse(localStorage.getItem("mlb-preferences"));
    return { collection, gamestate, matches, rosters, preferences };
  }

  return (
    <>
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
        <Typography variant="h3">A Shadow Has Fallen!</Typography>
        <Typography variant="body1">
          “Even the smallest code can bring about the greatest of crashes.
          <br /> Fear not, traveler, for this is but a passing error in the
          journey.”
        </Typography>

        <Divider />

        <Typography>
          You can download your current state to file and help us recover if
          something goes missing.
        </Typography>
        <Button
          color="primary"
          variant="outlined"
          fullWidth
          onClick={() => {
            const backupDate = new Date()
              .toLocaleDateString("en-UK", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/ /g, "-");
            const backup = getLocallyStoredDate();
            download(
              JSON.stringify(backup, null, 4),
              `mesbg_list_builder_backup_${backupDate}.json`,
              "application/json",
            );
          }}
        >
          Click here to download a backup
        </Button>
        <Divider />

        <Box
          sx={{
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography>
              <b>Help us help you!</b>
            </Typography>
            <Typography>
              Please do share a screenshot of this page with us either via email
              or in our discord. We do like to know what happend and resolve the
              issue.
            </Typography>
          </Box>

          <Typography textAlign="center" variant="body2">
            <a href="https://discord.gg/MZfUgRtV56">
              https://discord.gg/MZfUgRtV56
            </a>{" "}
            or{" "}
            <a href="mailto:support@mesbg-list-builder.com?subject=MESBG List Builder (v2024) - Bug/Correction">
              support@mesbg-list-builder.com
            </a>
            .
          </Typography>

          <Typography variant="body1" fontWeight="bold">
            Error log:
          </Typography>
          <Typography
            variant="caption"
            component="pre"
            sx={{
              px: 5,
              borderLeft: 1,
              textAlign: "left",
            }}
          >
            {errorMessage}
          </Typography>
        </Box>
      </Container>
    </>
  );
};
