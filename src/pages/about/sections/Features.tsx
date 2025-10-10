import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Paragraph } from "../components/Paragraph.tsx";
import { Section } from "../components/Section";

export const Features = () => (
  <Section title="Features">
    <Stack component="ul" direction="column" spacing={1}>
      <Box component="li">
        <Paragraph>
          A <strong>fully responsive</strong> web interface allowing you to
          build lists in the comfort of your own home as well as on the go.
          Including the ability to <strong>sign in and sync</strong> your
          devices to keep working on your army lists while you are away.
        </Paragraph>
      </Box>

      <Box component="li">
        <Paragraph>
          <strong>Custom (handmade) profile cards</strong> for all the models in
          the range, including all the books and downloadable PDF-files, and the
          ability to download and print them for your created army list for{" "}
          <strong>quick reference</strong>.{" "}
          <sup>*not usable as book replacement.</sup>
        </Paragraph>
      </Box>
      <Box component="li">
        <Paragraph>
          <strong>PDF print-out</strong> for your list, providing all a quick
          reference table for the stats, summary for the special rules and
          magical powers you have in play. Comes with Might/Will/Fate/Wounds
          tracking.
        </Paragraph>
      </Box>
      <Box component="li">
        <Paragraph>
          <strong>Game Mode</strong> which provides digital stat trackers as an
          interactive alternative to the PDF print-out, allowing you to;
          <ul>
            <Box component="li">
              Track the Might/Will/Fate/Wounds of your heroes.
            </Box>
            <Box component="li">
              Track the casualties and break point calculation of your army.
            </Box>
            <Box component="li">
              Additionally displays army bonuses and profile cards all on one
              screen.
            </Box>
          </ul>
        </Paragraph>
      </Box>
      <Box component="li">
        <Paragraph>
          <strong>All relevant roster information</strong> available; such as
          amount of units, bow & throw limit, breakpoint, ect - in the drawer on
          the right, which collapses for Mobile users.
        </Paragraph>
      </Box>
      <Box component="li">
        <Paragraph>
          Automatically includes mandatory units and provides alert{" "}
          <strong>notifications for illegal roster combinations</strong>.
        </Paragraph>
      </Box>
      <Box component="li">
        <Paragraph>
          <strong>Match History</strong> which allows you to keep track of your
          matches from Game Mode, as well as being able to add matches manually
          for when you use the PDF print-out.
          <ul>
            <Box component="li">
              You match history will be provided with various graphs to help
              visualise and break down your match experience over time.
            </Box>
          </ul>
        </Paragraph>
      </Box>
    </Stack>
  </Section>
);
