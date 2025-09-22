import { AutoAwesome, HowToReg } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { ReactNode } from "react";
import { HiIdentification } from "react-icons/hi2";
import { Changelog } from "./drawers/Changelog.tsx";
import { ProfileSearch } from "./drawers/ProfileSearch.tsx";
import { SpecialRulesSearch } from "./drawers/SpecialRulesSearch.tsx";
import { UnitSelector } from "./drawers/UnitSelector.tsx";

export enum DrawerTypes {
  UNIT_SELECTOR = "UNIT_SELECTOR",
  KEYWORD_SEARCH = "KEYWORD_SEARCH",
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
    DrawerTypes.KEYWORD_SEARCH,
    {
      title: (
        <Stack alignItems="center" direction="row" gap={2}>
          <AutoAwesome /> Special rules, Magic & Heroics
        </Stack>
      ),
      children: <SpecialRulesSearch />,
    },
  ],
  [
    DrawerTypes.PROFILE_SEARCH,
    {
      title: (
        <Stack alignItems="center" direction="row" gap={2}>
          <HiIdentification /> Profiles
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
