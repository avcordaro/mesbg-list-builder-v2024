import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useThemeContext } from "../../theme/ThemeContext.tsx";
import { About as AboutSection } from "./sections/About.tsx";
import { Contact as ContactSection } from "./sections/Contact.tsx";
import { Features as FeaturesSection } from "./sections/Features.tsx";
import { Roadmap as RoadmapSection } from "./sections/Roadmap.tsx";

export const About = () => {
  const theme = useTheme();
  const themeContext = useThemeContext();

  return (
    <Container maxWidth={false} sx={{ mt: 2, mb: 5 }}>
      <Stack
        direction="row"
        gap={5}
        flexWrap="wrap"
        justifyContent="space-around"
        sx={{ mb: 5 }}
      >
        <AboutSection />
        <ContactSection />
        <FeaturesSection />
        <RoadmapSection />
      </Stack>

      <center>
        <Typography>
          <i>
            If you have an feature idea don&apos;t hesitate to contact us at{" "}
            <a
              href="mailto:support@mesbg-list-builder.com?subject=MESBG List Builder (v2024)"
              style={{
                color:
                  themeContext.mode === "dark"
                    ? theme.palette.secondary.light
                    : theme.palette.secondary.dark,
              }}
            >
              support@mesbg-list-builder.com
            </a>
          </i>
        </Typography>
      </center>
    </Container>
  );
};
