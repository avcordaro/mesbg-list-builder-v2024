import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import armyListData from "../../../../assets/data/army_list_data.json";
import { useRosterBuildingState } from "../../../../state/roster-building";
import { ArmyListData } from "../../../../types/army-list-data.types.ts";
import { isMovieQuote } from "../../../../utils/string.ts";
import { CustomSwitch } from "../../switch/CustomSwitch.tsx";
import { RosterInformationProps } from "../RosterInformation.tsx";
import { RosterInformationSection } from "../RosterInformationSection.tsx";

export const SpecialRules: FunctionComponent<
  Pick<RosterInformationProps, "roster"> & { size?: "dense" | "normal" }
> = ({ roster, size = "normal" }) => {
  const armyListMetadata = (armyListData as ArmyListData)[roster.armyList];
  const { updateRoster } = useRosterBuildingState();
  const trollUpgrades = roster.metadata.tttSpecialUpgrades || [];

  if (!armyListMetadata || armyListMetadata.special_rules.length === 0)
    return <></>;

  function changeRuleState(rule: string, enabled: boolean) {
    const currentUpgrades = [...trollUpgrades];
    if (enabled) {
      // Add the rule to the array if it's not already present
      if (!currentUpgrades.includes(rule)) {
        currentUpgrades.push(rule);
      }
    } else {
      // Remove the rule from the array if it's present
      const index = currentUpgrades.indexOf(rule);
      if (index !== -1) {
        currentUpgrades.splice(index, 1);
      }
    }

    updateRoster({
      ...roster,
      metadata: {
        ...roster.metadata,
        tttSpecialUpgrades: currentUpgrades,
      },
    });
  }

  return (
    <RosterInformationSection title="Special rules">
      <Box component="ul" sx={{ listStyle: "none", pl: 2 }}>
        {armyListMetadata.special_rules.map((rule, index) => (
          <Box
            component="li"
            key={index}
            sx={{ py: size === "normal" ? 1 : 0 }}
          >
            {isMovieQuote(rule.title) ? (
              <Typography sx={{ ml: rule.troll_purchase === true ? -1 : 0 }}>
                {rule.troll_purchase === true && (
                  <CustomSwitch
                    checked={trollUpgrades.includes(rule.title)}
                    onChange={(_, checked) =>
                      changeRuleState(rule.title, checked)
                    }
                  />
                )}
                <b>
                  <i>{rule.title}</i>
                </b>
              </Typography>
            ) : (
              <Typography sx={{ ml: rule.troll_purchase === true ? -1 : 0 }}>
                {rule.troll_purchase === true && (
                  <CustomSwitch
                    checked={trollUpgrades.includes(rule.title)}
                    onChange={(_, checked) =>
                      changeRuleState(rule.title, checked)
                    }
                  />
                )}
                <b>
                  {rule.title}{" "}
                  {rule.title === "A Troll's Hoard" && (
                    <i>({trollUpgrades.length * 50} points)</i>
                  )}
                </b>
              </Typography>
            )}
            <Stack gap={1}>
              {rule.description.split("\n").map((line, index) => (
                <Typography key={index}>{line}</Typography>
              ))}
            </Stack>
          </Box>
        ))}
      </Box>
    </RosterInformationSection>
  );
};
