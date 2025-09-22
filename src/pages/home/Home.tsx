import { BugReport } from "@mui/icons-material";
import { Button } from "@mui/material";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FaPatreon } from "react-icons/fa";
import discord from "../../assets/images/homepage/discord.png";
import { FeatureTabs } from "./FeatureTabs.tsx";

export const DISCORD_LINK = "https://discord.gg/Hmjetd9NDf";
export const PATREON_LINK = "https://www.patreon.com/mesbg_list_builder";

export const Home = () => {
  return (
    <Container maxWidth={false} sx={{ mt: 2, mb: 5 }}>
      <Stack direction="column" gap={1} flexWrap="wrap">
        <Stack direction="row" justifyContent="space-between">
          <Stack gap={1} sx={{ maxWidth: "min(100%, 84ch)" }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                variant="h5"
                className="middle-earth"
                sx={{ pt: 2.4, my: 0 }}
              >
                Welcome to the
              </Typography>
              <a href={DISCORD_LINK} target="_blank" rel="noreferrer">
                <img
                  src={discord}
                  alt="join the list builder on discord"
                  style={{ height: "44px" }}
                />
              </a>
            </Stack>
            <Typography variant="h3" className="middle-earth" sx={{ mt: 0 }}>
              MESBG List Builder
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.3rem" }}>
              The MESBG List Builder is a unofficial utility tool for the Middle
              Earth Strategy Battle Game by Games Workshop. This webapp strives
              to be the best list builder out there by creating an easy to
              navigate and simple to use application.
            </Typography>

            <Typography variant="body2" sx={{ fontSize: "1rem" }}>
              Please reach out to us you have any questions, request or
              corrections. You can do so via our the mail using the{" "}
              <BugReport fontSize="small" sx={{ verticalAlign: "middle" }} />
              -icon on the left or via discord.
            </Typography>

            <Typography variant="body2" sx={{ fontSize: "1rem" }}>
              MLB is free for everyone and will always stay that way. No
              restrictions, no ads - as these will only reduce the user
              experience. However, any support is always appreciated, be it by
              word of mouth recommendation or by sharing your lists with
              admission on Reddit and Facebook.
            </Typography>

            <Typography variant="body2" sx={{ fontSize: "1rem" }}>
              If you want to be a true hero you can also support us via Patreon,
              though this is completely optional.
            </Typography>

            <Button
              variant="text"
              size="large"
              startIcon={<FaPatreon />}
              sx={{
                my: 2,
                color: "#F96854",
              }}
              onClick={() => window.open(PATREON_LINK, "_blank")}
            >
              Support us on patreon
            </Button>
          </Stack>
        </Stack>

        <FeatureTabs />
      </Stack>
    </Container>
  );
};
