import { Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import data from "../../../../assets/data/warning_rules.json";
import { useRosterInformation } from "../../../../hooks/useRosterInformation.ts";
import { isSelectedUnit, Roster } from "../../../../types/roster.ts";
import {
  WarningRule,
  WarningRules,
} from "../../../../types/warning-rules.types.ts";
import { RosterInformationProps } from "../RosterInformation.tsx";
import { RosterInformationSection } from "../RosterInformationSection.tsx";

function checkRequiresOne(rule: WarningRule, setOfModelIds: string[]): boolean {
  return !rule.dependencies.some((compulsoryModel) =>
    setOfModelIds.includes(compulsoryModel),
  );
}

function checkRequiresAll(rule: WarningRule, setOfModelIds: string[]): boolean {
  return !rule.dependencies.every((compulsoryModel) =>
    setOfModelIds.includes(compulsoryModel),
  );
}

function checkCompulsory(rule: WarningRule, setOfModelIds: string[]): boolean {
  return !rule.dependencies.every((compulsoryModel) =>
    setOfModelIds.includes(compulsoryModel),
  );
}

function extraScriptedRosterWarnings(roster: Roster): WarningRule[] {
  if (
    roster.armyList === "The Eagles" ||
    roster.armyList === "Radagast's Alliance"
  ) {
    const units = roster.warbands
      .flatMap((wb) => [wb.hero, ...wb.units])
      .filter(isSelectedUnit)
      .filter((unit) => unit.name.includes("Great Eagle"))
      .reduce(
        (a, b) => {
          if (!a[b.name]) {
            a[b.name] = 0;
          }
          a[b.name] += b.quantity;
          return a;
        },
        { "Great Eagle": 0, "Fledgeling Great Eagle": 0 },
      );
    const diff = units["Fledgeling Great Eagle"] - units["Great Eagle"];
    if (diff > 0) {
      return [
        {
          warning: `${roster.armyList} may not include more Fledgeling Great Eagles than Great Eagles. There are currently ${diff} Fledgeling Great Eagle too many.`,
          type: undefined,
          dependencies: [],
        },
      ];
    }
  }

  if (roster.armyList === "Rise of the Necromancer") {
    const mustBeBrokenUp =
      roster.warbands
        .flatMap((wb) => [wb.hero, ...wb.units])
        .filter(isSelectedUnit)
        .filter((unit) =>
          [
            "Hunter Orc Captain",
            "Hunter Orc Warrior",
            "Hunter Orc Warg Rider",
            "Fell Warg",
            "Mirkwood Giant Spider",
            "Mirkwood Hunting Spider",
          ].includes(unit.name),
        ).length > 0;

    if (mustBeBrokenUp) {
      const hasHeroesInWarband =
        roster.warbands
          .flatMap((wb) => wb.units)
          .filter(isSelectedUnit)
          .filter((unit) => unit.unit_type.includes("Hero")).length > 0;
      if (hasHeroesInWarband) {
        return [
          {
            warning: `Heroes cannot be followers in another hero's warband if your army includes any Warrior models or Hunter Orc Captains.`,
            type: undefined,
            dependencies: [],
          },
        ];
      }
    }
  }

  if (roster.armyList === "Men of the West") {
    const containsAnyMountedHero = !!roster.warbands.find(
      ({ hero }) =>
        isSelectedUnit(hero) &&
        !!hero.options.find(
          (option) => option.type === "mount" && option.quantity > 0,
        ),
    );
    const hasGwaihir = !!roster.warbands.find(
      ({ hero }) => isSelectedUnit(hero) && hero.name === "Gwaihir",
    );

    if (containsAnyMountedHero && hasGwaihir) {
      return [
        {
          warning: `If your Army includes any Cavalry models then it cannot include any Eagle models, and vice versa.`,
          type: undefined,
          dependencies: [],
        },
      ];
    }
  }

  return [];
}

function isActiveRule(setOfModelIds: string[]) {
  return (rule: WarningRule) => {
    switch (rule.type) {
      case "requires_one":
        return checkRequiresOne(rule, setOfModelIds);
      case "requires_all":
        return checkRequiresAll(rule, setOfModelIds);
      case "compulsory":
        return checkCompulsory(rule, setOfModelIds);
      default:
        return true;
    }
  };
}

export const Warnings: FunctionComponent<RosterInformationProps> = ({
  roster,
}) => {
  const rosterInformation = useRosterInformation();
  const setOfModelIds = rosterInformation.getSetOfModelIds();
  const allWarnings = data as WarningRules;

  const possibleWarnings = [
    ...(allWarnings[roster.armyList] || []),
    ...setOfModelIds.flatMap((model) => allWarnings[model]),
    ...extraScriptedRosterWarnings(roster),
  ].filter((v) => !!v);

  if (!possibleWarnings || possibleWarnings.length === 0) return <></>;

  const activeWarnings = possibleWarnings.filter(isActiveRule(setOfModelIds));
  if (activeWarnings.length === 0) return <></>;

  return (
    <RosterInformationSection title="Warnings">
      <Stack gap={2}>
        {activeWarnings.map(({ warning }, index) => (
          <Alert key={index} icon={false} severity="error">
            <Typography>{warning}</Typography>
          </Alert>
        ))}
      </Stack>
    </RosterInformationSection>
  );
};
