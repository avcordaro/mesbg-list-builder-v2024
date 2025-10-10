import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FaPatreon } from "react-icons/fa";
import discord from "../../../assets/images/homepage/discord.png";
import { DISCORD_LINK, PATREON_LINK } from "../../home/Home.tsx";
import { Link } from "../components/Link.tsx";
import { Paragraph } from "../components/Paragraph";
import { Section } from "../components/Section";

export const Contact = () => (
  <Section
    title="Connect with us"
    additionalButton={
      <a href={DISCORD_LINK} target="_blank" rel="noreferrer">
        <img
          src={discord}
          alt="join the list builder on discord"
          style={{ height: "45px", float: "right" }}
        />
      </a>
    }
  >
    <Paragraph>
      We welcome feedback, questions, and contributions from the community. You
      can reach us through the following channels:
    </Paragraph>

    <Stack component="ul" direction="column" spacing={1}>
      <Box component="li">
        <strong>Discord</strong>: Join our community to chat in real time, ask
        questions, or share ideas.
      </Box>
      <Box component="li">
        <strong>GitHub</strong>: Report issues, contribute code, or follow
        ongoing development.
      </Box>
      <Box component="li">
        <strong>Email</strong>: Prefer direct contact? Reach us at{" "}
        <Link to="mailto:support@mesbg-list-builder.com?subject=MESBG List Builder (v2024) - Feature request">
          support@mesbg-list-builder.com
        </Link>
        .
      </Box>
      <Box component="li">
        <strong>Patreon</strong>: Support our work and gain access to exclusive
        updates and insights.
      </Box>
    </Stack>

    <Button
      variant="contained"
      color="inherit"
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
  </Section>
);
