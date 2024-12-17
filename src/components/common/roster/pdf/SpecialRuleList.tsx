import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import armyListRules from "../../../../assets/data/army_list_data.json";
import keywords from "../../../../assets/data/keywords.json";

import { Profile } from "../../../../hooks/profile-utils/profile.type.ts";
import { useRosterInformation } from "../../../../hooks/useRosterInformation.ts";
import { ArmyListData } from "../../../../types/army-list-data.types.ts";
import { isMovieQuote } from "../../../../utils/string.ts";

interface SpecialRuleListProps {
  profiles: Profile[];
}

type SpecialRule = {
  name: string;
  description: string;
  type: string;
};

function duplicates(item: SpecialRule, index: number, self: SpecialRule[]) {
  return index === self.findIndex((other) => other.name === item.name);
}

function mapSpecialRule(sr: string) {
  if (
    [
      "Poisoned Sword",
      "Poisoned Spear",
      "Poisoned War Spear",
      "Poisoned Blowpipe",
      "Poisoned Fangs",
    ].includes(sr)
  ) {
    const rule = keywords.find(
      (keyword) => keyword.name === "Poisoned Weapons",
    );
    return {
      name: sr,
      type: rule?.active_passive,
      description: rule?.description,
    };
  }

  const rule = keywords.find(
    (keyword) => keyword.name === sr.replace(/\(.*?\)/g, "(X)"),
  );
  return {
    name: rule?.name || sr,
    type: rule?.active_passive,
    description: rule?.description,
  };
}

function mapAopRule(rule: {
  name: string;
  type: "Active" | "Passive";
  description: string;
}) {
  return {
    ...rule,
    type: rule.type || "Passive",
  };
}

export const SpecialRuleList = ({ profiles }: SpecialRuleListProps) => {
  const {
    roster: { armyList },
  } = useRosterInformation();
  const armyListRule = (armyListRules as ArmyListData)[armyList];

  const specialRules: SpecialRule[] = profiles
    .flatMap((profile) => [
      ...profile.active_or_passive_rules.map(mapAopRule),
      ...profile.special_rules.map(mapSpecialRule),
      ...(profile.additional_stats?.flatMap((additionalProfile) => [
        ...additionalProfile.active_or_passive_rules.map(mapAopRule),
        ...additionalProfile.special_rules.map(mapSpecialRule),
      ]) || []),
    ])
    .filter(duplicates)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <Box id="pdf-rules">
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Army special rules
          </Typography>
          {armyListRule.special_rules.map((rule, index) => (
            <Box key={index}>
              {isMovieQuote(rule.title) ? (
                <Typography>
                  <b>
                    <i>{rule.title}</i>
                  </b>
                </Typography>
              ) : (
                <Typography>
                  <b>{rule.title}</b>
                </Typography>
              )}
              <Typography>{rule.description}</Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="h5">Special rules</Typography>
        <Stack gap={1} sx={{ py: 1 }}>
          {specialRules.map((rule) => (
            <Box key={rule.name} sx={{ py: 0.8 }}>
              <Typography variant="body1">
                <b>
                  {rule.name} {rule.type && <>({rule.type})</>}
                </b>
              </Typography>
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{
                  __html: rule.description?.replaceAll("\n\n", "<br />"),
                }}
              />
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  );
};
