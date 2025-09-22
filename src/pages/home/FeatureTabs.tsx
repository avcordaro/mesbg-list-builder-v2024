import { Box, Tab, Tabs } from "@mui/material";
import Typography from "@mui/material/Typography";
import { SyntheticEvent, useState } from "react";
import history from "../../assets/images/homepage/game-history.png";
import gamemode from "../../assets/images/homepage/gamemode.png";
import builder from "../../assets/images/homepage/list-building.png";
import quickRef from "../../assets/images/homepage/quick-reference.png";
import { FeatureTab } from "./FeatureTab";

function a11yProps(index: number) {
  return {
    id: `feature-tab-${index}`,
    "aria-controls": `feature-tabpanel-${index}`,
  };
}

export const FeatureTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ my: 3, maxWidth: "min(100%, 84ch)" }}>
      <Typography variant="h4" className="middle-earth" sx={{ mb: 2 }}>
        Features
      </Typography>

      <Box>
        <Tabs
          variant="fullWidth"
          scrollButtons="auto"
          value={value}
          onChange={handleChange}
        >
          <Tab
            label={
              <span>
                Create your
                <br />
                army lists
              </span>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <span>
                lookup
                <br />
                special rules
              </span>
            }
            {...a11yProps(1)}
          />
          <Tab
            label={
              <span>
                Use digital
                <br />
                trackers
              </span>
            }
            {...a11yProps(3)}
          />
          <Tab
            label={
              <span>
                Record the
                <br />
                games
              </span>
            }
            {...a11yProps(4)}
          />
        </Tabs>

        <FeatureTab
          value={value}
          index={0}
          image={builder}
          imageAlt="screenshot of the roster builder"
          bullets={[
            "Create and manage *unlimited* army lists",
            "Add warbands with heroes and units",
            "Give a *clear overview* of your roster including points, break points and limits",
            "Reorder your army list using *drag and drop*",
            "Save your army lists locally and allow importing on other devices",
            "Get a *printable* document of your army lists",
            [
              "Includes Stats table, army composition, special rules and stat trackers",
              "Contains useful information for your opponent at a tournament",
              "Customizable 'chapters' using the app settings",
            ],
          ]}
        />
        <FeatureTab
          value={value}
          index={1}
          image={quickRef}
          imageAlt="screenshot of the special rules drawer"
          bullets={[
            "Have a *quick reference* of rules using the side drawer",
            "Includes Special rules, Magic and Heroic actions",
            "Lookup the profile of any unit, *from anywhere* in the webapp",
            "Lookup any of the charts such as Jump/Leap table, To Wound Chart and many more",
            "Filter and search for specific keywords to find what you need",
          ]}
        />
        <FeatureTab
          value={value}
          index={2}
          image={gamemode}
          imageAlt="screenshot of the gamemode screen"
          bullets={[
            "Keep track of your game using the *digital trackers*",
            "Might/Will/Fate trackers for all your *heroes*",
            "Additional trackers for all your *multi-wound models*",
            "Add *custom trackers* to keep track of turns, foresight points or anything you need",
            "Show counters for 'until broken' and 'until quartered'",
            "Quick access to your stats-table and profile cards",
            "Allows recording of match result with prefilled information",
          ]}
        />
        <FeatureTab
          value={value}
          index={3}
          image={history}
          imageAlt="screenshot of the graphs on the match history page"
          bullets={[
            "Keep track of all your matches and results",
            "Get an breakdown of all your stats over the past year",
            "Show Win/Loss ratios as well as Wins and Losses per scenario or opponent",
            "Use the 'end game' from the gamemode to automatically guide you though Victory points",
          ]}
        />
      </Box>
    </Box>
  );
};
