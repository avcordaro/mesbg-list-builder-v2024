import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useThemeContext } from "../theme/ThemeContext.tsx";

export const About = () => {
  const theme = useTheme();
  const themeContext = useThemeContext();

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 5 }}>
      <Stack direction="row" gap={5} flexWrap="wrap">
        <Stack gap={2}>
          <Typography variant="h4" className="middle-earth">
            About
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "18px" }}>
            The MESBG List Builder is a webapp developed by Alex Cordaro and
            Marcel Hollink. We strive to create the best list builder out there
            by creating an easy to navigate and simple to use application.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "18px" }}>
            The webapp was originally built by Alex for the Middle Earth
            Strategy Battle game released in 2018, which was later adapted to
            fit mobile devices by Marcel. We both have a great passion for this
            tool and love to explore what we can achieve for the community by
            providing new updates and features.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "18px" }}>
            Both of us spend our free time maintaining and updating the webapp
            and are not interested in making the app paid or adding adverts
            (which would disrupt the user experience). There is no need for you
            to pull your wallet to build your army list.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "18px" }}>
            The list builder is open source (
            <a
              href="https://github.com/avcordaro/mesbg-list-builder-v2024"
              target="_blank"
              rel="noreferrer"
              style={{
                color:
                  themeContext.mode === "dark"
                    ? theme.palette.secondary.light
                    : theme.palette.secondary.dark,
              }}
            >
              you can find it here
            </a>
            ). If you&apos;d like to help you can fork the repository and
            provide your corrections via pull request. You can also inform us of
            any errors by email:{" "}
            <a
              href="mailto:support@mesbg-list-builder.com?subject=MESBG List Builder (v2024) - Bug/Correction"
              style={{
                color:
                  themeContext.mode === "dark"
                    ? theme.palette.secondary.light
                    : theme.palette.secondary.dark,
              }}
            >
              support@mesbg-list-builder.com
            </a>
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "18px" }}>
            A list of currently reported and open issues can be found in{" "}
            <a
              href="https://github.com/avcordaro/mesbg-list-builder-v2024/issues"
              target="_blank"
              rel="noreferrer"
              style={{
                color:
                  themeContext.mode === "dark"
                    ? theme.palette.secondary.light
                    : theme.palette.secondary.dark,
              }}
            >
              the Github issues list
            </a>
            . Please refer to this list when reporting any issues to avoid
            duplicates.
          </Typography>

          <Typography variant="h4" className="middle-earth" sx={{ mb: 2 }}>
            Features
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "16px" }}>
            <Stack component="ul" sx={{ pl: 0 }} gap={1}>
              <Box component="li">
                A <strong>fully responsive</strong> web interface allowing you
                to build lists in the comfort of your own home as well as on the
                go.
              </Box>
              <Box component="li">
                <strong>Custom-made profile cards</strong> for all models across
                The Lord of the Rings, The Hobbit and expansions.
              </Box>
              <Box component="li">
                <strong>PDF print-out</strong> for your list, providing all
                profile stats, special rules, magical powers,
                Might/Will/Fate/Wounds tracking etc.
              </Box>
              <Box component="li">
                <strong>Game Mode</strong> which provides digital stat trackers
                as an interactive alternative to the PDF print-out, allowing you
                to;
                <ul>
                  <Box component="li">
                    Track the Might/Will/Fate/Wounds of your heroes.
                  </Box>
                  <Box component="li">
                    Track the casualties and break point calculation of your
                    army.
                  </Box>
                  <Box component="li">
                    Additionally displays army bonuses and profile cards all on
                    one screen.
                  </Box>
                </ul>
              </Box>
              <Box component="li">
                <strong>All relevant roster information available</strong> in
                the drawer on the right, which collapses for Mobile users.
              </Box>
              <Box component="li">
                Alerts providing{" "}
                <strong>notifications for illegal roster combinations</strong>{" "}
                and required models.
              </Box>
              <Box component="li">
                <strong>Match History</strong> which allows you to keep track of
                your matches from Game Mode, as well as being able to add
                matches manually for when you use the PDF print-out.
                <ul>
                  <Box component="li">
                    You match history will be provided with various graphs to
                    help visualise and break down your match experience over
                    time.
                  </Box>
                </ul>
              </Box>
              <Box component="li">
                Uses the browsers internal storage API to{" "}
                <strong>persist your rosters between sessions</strong>, and also{" "}
                <strong>provides import/export</strong> options to keep your
                data safe when clearing your browser history and data.
              </Box>
            </Stack>
          </Typography>
          <Typography variant="h4" className="middle-earth">
            Roadmap
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "18px" }}>
            Even though the app should already include everything you would need
            to build your army lists, there is always work to be done. Think of
            FAQ&apos;s and errata that need to be implemented or bugs on our
            side that need be be squashed. Aside from those few things we have
            our own list of things we still want to include.
          </Typography>
          <Stack component="ul" sx={{ listStyle: "none", pl: 0 }} gap={1}>
            <Box component="li">
              <Typography>
                <strong>Internationalization;</strong> We are committed to
                support the many different MESBG communities all around the
                world. With accessibility being one of our top priorities, we
                would also like to make it linguistically available for
                everyone. Staring with Spanish as our first focus, we&apos;d
                like to open our gates for those willing to help translate the
                many rules and profiles.
              </Typography>
            </Box>
            <Box component="li">
              <Typography>
                <strong>Accounts;</strong> Allowing users to login using their
                favorite authentication provider, like Facebook, Google and
                maybe others platform. Or let them create an custom
                email/password account. This will allow users with an account to
                save their rosters and match history on our servers and allows
                them to sync more easily between their computer and mobile
                device while also reducing the risk of losing their browser
                storage.
              </Typography>
            </Box>
            <Box component="li">
              <Typography>
                <strong>Sharing rosters;</strong> The MESBG List Builder
                providers multiple ways of exporting your roster and sharing it
                with the world. One way to share rosters is currently
                impossible: Sharing the a link to the actual roster. Once we set
                up our database for creating and managing rosters based on an
                authenticated account we can provide more fancy stuff like that.
                Such as creating a link to a readonly roster and allowing users
                to import it into their own accounts.
              </Typography>
            </Box>
          </Stack>
          <Typography>
            <i>
              If you have an feature idea don&apos;t hesitate to contact us at{" "}
              <a
                href="mailto:support@mesbg-list-builder.com?subject=MESBG List Builder (v2024) - Feature request"
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
        </Stack>
      </Stack>
    </Container>
  );
};
