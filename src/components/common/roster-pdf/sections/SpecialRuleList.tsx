import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import keywords from "../../../../assets/data/keywords.json";

import { armyListData } from "../../../../assets/data.ts";
import { useRosterInformation } from "../../../../hooks/calculations-and-displays/useRosterInformation.ts";
import { Profile } from "../../../../hooks/profiles/profile-utils/profile.type.ts";
import { useUserPreferences } from "../../../../state/preference";
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
  if (sr.endsWith("bane")) {
    const rule = keywords.find((keyword) => keyword.name === "Bane Weapons");
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
    preferences: { removePdfPageBreak, hidePdfSpecialRules, hidePdfArmyRules },
  } = useUserPreferences();
  const {
    roster: { armyList, metadata },
  } = useRosterInformation();
  const armyListRules = armyListData[armyList];

  const specialRules: SpecialRule[] = profiles
    .flatMap((profile) => [
      ...profile.active_or_passive_rules.map(mapAopRule),
      ...profile.special_rules.map(mapSpecialRule),
      ...(profile.additional_stats?.flatMap((additionalProfile) => [
        ...additionalProfile.active_or_passive_rules.map(mapAopRule),
        ...additionalProfile.special_rules.map(mapSpecialRule),
      ]) || []),
    ])
    .concat(armyListRules.rule_highlights?.map(mapSpecialRule))
    .filter(duplicates)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <Box id="pdf-rules" className={removePdfPageBreak ? "" : "page-break"}>
        {!hidePdfArmyRules && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Army special rules
            </Typography>
            <Stack gap={1}>
              {armyListRules.special_rules
                .filter((rule) => {
                  if (armyList === "The Three Trolls") {
                    return (
                      rule.troll_purchase !== true ||
                      (metadata.tttSpecialUpgrades &&
                        metadata.tttSpecialUpgrades.includes(rule.title))
                    );
                  }
                  return true;
                })
                .map((rule, index) => (
                  <Box
                    key={index}
                    component={rule.troll_purchase === true ? "ul" : "div"}
                    sx={{ pageBreakInside: "avoid" }}
                  >
                    {isMovieQuote(rule.title) ? (
                      <Typography
                        component={rule.troll_purchase === true ? "li" : "p"}
                      >
                        <b>
                          <i>{rule.title}</i>
                        </b>
                      </Typography>
                    ) : (
                      <Typography
                        component={rule.troll_purchase === true ? "li" : "p"}
                      >
                        <b>{rule.title}</b>
                      </Typography>
                    )}
                    <Stack gap={0.5}>
                      {rule.description.split("\n").map((paragraph, index) => (
                        <Typography
                          key={index}
                          dangerouslySetInnerHTML={{ __html: paragraph }}
                        />
                      ))}
                    </Stack>
                  </Box>
                ))}
            </Stack>
          </Box>
        )}

        {!hidePdfSpecialRules && (
          <Box>
            <Typography variant="h5">Special rules</Typography>
            <Stack gap={1} sx={{ py: 1 }}>
              {specialRules.map((rule) => (
                <Box key={rule.name} sx={{ py: 0.8, pageBreakInside: "avoid" }}>
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
        )}
      </Box>
    </>
  );
};
