import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import profiles from "../../assets/data/profile_data_new.json";
import { DynamicCard } from "../../components/atoms/unit-profile/dynamic/DynamicCard.tsx";
import { Profile } from "../../components/atoms/unit-profile/dynamic/profile-card/types.ts";

export const ProfileCardDemoPage = () => {
  return (
    <Container maxWidth={false} sx={{ zoom: "45%", mt: 2, mb: 10 }}>
      <Typography variant="h4" className="middle-earth">
        Profilecard demo page
      </Typography>

      <Typography
        sx={{ width: "80ch", textAlign: "justify", lineHeight: 1.2, my: 2 }}
      >
        This card shows all the dynamically generated profile cards in a way
        they are easy to debug by the developers. They provide an overview of
        what cards are in the data file and how they are presented.
      </Typography>

      <Divider sx={{ my: 2 }}>
        <Typography variant="h5" className="middle-earth">
          Custom design
        </Typography>
      </Divider>

      <Stack direction="row" flexWrap="wrap" gap={1}>
        {Object.values(profiles as Record<string, Profile>)
          .filter((profile) => profile.card_config.layout === "custom")
          .map((profile) => (
            <DynamicCard
              key={profile.id}
              name={profile.profile}
              origin={profile.origin}
            />
          ))}
      </Stack>

      <Divider sx={{ my: 2 }}>
        <Typography variant="h5" className="middle-earth">
          Customized sets
        </Typography>
      </Divider>

      <Stack direction="row" flexWrap="wrap" gap={1}>
        {Object.values(profiles as Record<string, Profile>)
          .filter((profile) =>
            [
              "custom-set-1",
              "custom-set-2",
              "rules-aside",
              "rule-heavy",
            ].includes(profile.card_config.layout),
          )
          .map((profile) => (
            <DynamicCard
              key={profile.id}
              name={profile.profile}
              origin={profile.origin}
            />
          ))}
      </Stack>

      <Divider sx={{ my: 2 }}>
        <Typography variant="h5" className="middle-earth">
          Simple hero cards
        </Typography>
      </Divider>

      <Stack direction="row" flexWrap="wrap" gap={1}>
        {Object.values(profiles as Record<string, Profile>)
          .filter((profile) => profile.card_config.layout === "captain")
          .map((profile) => (
            <DynamicCard
              key={profile.id}
              name={profile.profile}
              origin={profile.origin}
            />
          ))}
      </Stack>

      <Divider sx={{ my: 2 }}>
        <Typography variant="h5" className="middle-earth">
          Warrior cards
        </Typography>
      </Divider>

      <Stack direction="row" flexWrap="wrap" gap={1}>
        {Object.values(profiles as Record<string, Profile>)
          .filter((profile) => profile.card_config.layout === "warrior")
          .map((profile) => (
            <DynamicCard
              key={profile.id}
              name={profile.profile}
              origin={profile.origin}
            />
          ))}
      </Stack>

      <Box sx={{ my: 10 }}>
        <Typography variant="h4" className="middle-earth">
          Not implemented profile cards:
        </Typography>
        <Stack direction="row" flexWrap="wrap">
          {Object.values(profiles as Record<string, Profile>)
            .filter((profile) =>
              ["mount", "siege"].includes(profile.card_config.layout),
            )
            .sort((a, b) =>
              a.card_config.layout.localeCompare(b.card_config.layout),
            )
            .map((profile) => (
              <Box key={profile.id} sx={{ flex: "1 0 21%", mx: 5 }}>
                <Typography
                  component="span"
                  lineHeight={1}
                  color={getColor(profile.card_config.layout)}
                >
                  <strong>{profile.profile}</strong> from{" "}
                  <strong>{profile.origin}</strong>:{" "}
                  <i>{profile.card_config.layout}</i>
                </Typography>
              </Box>
            ))}
        </Stack>
      </Box>
    </Container>
  );
};

function getColor(layout: string) {
  if (layout == "custom") {
    return "error.light";
  }
  if (layout == "siege") {
    return "primary.light";
  }
  if (layout == "additional") {
    return "secondary.light";
  }
  if (layout == "none" || layout == "mount") {
    return "textDisabled";
  }

  return "#000";
}
