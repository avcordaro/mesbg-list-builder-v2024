import { AutoAwesome, HowToReg } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { ReactNode } from "react";

import { GiMightyForce } from "react-icons/gi";
import { HiFire } from "react-icons/hi";
import { Changelog } from "./drawers/Changelog.tsx";
import { HeroicActionsSearch } from "./drawers/HeroicActionsSearch.tsx";
import { MagicalPowersSearch } from "./drawers/MagicalPowersSearch.tsx";
import { ProfileSearch } from "./drawers/ProfileSearch.tsx";
import { SpecialRulesSearch } from "./drawers/SpecialRulesSearch.tsx";
import { UnitSelector } from "./drawers/UnitSelector.tsx";

export enum DrawerTypes {
  UNIT_SELECTOR = "UNIT_SELECTOR",
  SPECIAL_RULE_SEARCH = "SPECIAL_RULE_SEARCH",
  MAGICAL_POWER_SEARCH = "MAGICAL_POWER_SEARCH",
  HEROIC_ACTION_SEARCH = "HEROIC_ACTION_SEARCH",
  PROFILE_SEARCH = "PROFILE_SEARCH",
  CHANGELOG = "CHANGELOG",
}

export type DrawerProps = {
  children: ReactNode;
  title: string | ReactNode;
};

export const drawers = new Map<DrawerTypes, DrawerProps>([
  [
    DrawerTypes.UNIT_SELECTOR,
    {
      title: (
        <Stack alignItems="center" direction="row" gap={2}>
          <HowToReg /> Unit Selector
        </Stack>
      ),
      children: <UnitSelector />,
    },
  ],
  [
    DrawerTypes.SPECIAL_RULE_SEARCH,
    {
      title: (
        <Stack alignItems="center" direction="row" gap={2}>
          <AutoAwesome /> Special Rules
        </Stack>
      ),
      children: <SpecialRulesSearch />,
    },
  ],
  [
    DrawerTypes.MAGICAL_POWER_SEARCH,
    {
      title: (
        <Stack alignItems="center" direction="row" gap={2}>
          <HiFire /> Magical Powers
        </Stack>
      ),
      children: <MagicalPowersSearch />,
    },
  ],
  [
    DrawerTypes.HEROIC_ACTION_SEARCH,
    {
      title: (
        <Stack alignItems="center" direction="row" gap={2}>
          <GiMightyForce /> Heroic Actions
        </Stack>
      ),
      children: <HeroicActionsSearch />,
    },
  ],
  [
    DrawerTypes.PROFILE_SEARCH,
    {
      title: (
        <Stack alignItems="center" direction="row" gap={2}>
          <GiMightyForce /> Profiles
        </Stack>
      ),
      children: <ProfileSearch />,
    },
  ],
  [
    DrawerTypes.CHANGELOG,
    {
      title: "Changelog",
      children: <Changelog />,
    },
  ],
]);
