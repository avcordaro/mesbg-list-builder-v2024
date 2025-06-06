import { SiegeEquipment, Unit } from "./mesbg-data.types.ts";

export type SelectedUnit = Unit & {
  id: string;
  pointsPerUnit: number;
  pointsTotal: number;
  quantity: number;
  compulsory?: boolean;
};

export type FreshUnit = {
  id: string;
};

export type Warband = {
  id: string;
  hero: SelectedUnit | null;
  units: (FreshUnit | SelectedUnit | SiegeEquipment)[];
  meta: {
    num: number;
    points: number;
    units: number;
    heroes: number;
    maxUnits: number | "-";
    bows: number;
    bowLimit: number;
    throwingWeapons: number;
    throwLimit: number;
  };
};

export const isSelectedUnit = (
  unit: FreshUnit | SelectedUnit | SiegeEquipment,
): unit is SelectedUnit => !!(unit as SelectedUnit)?.model_id;

export const isSiegeEquipment = (
  unit: FreshUnit | SelectedUnit | SiegeEquipment,
): unit is SiegeEquipment =>
  !!(unit as SelectedUnit)?.model_id && !!(unit as SiegeEquipment).siege_role;

export type Roster = {
  version: string;
  id: string;
  name: string;
  armyList: string;
  warbands: Warband[];
  group?: string;
  metadata: {
    leader: string | null;
    leaderCompulsory?: boolean;
    points: number;
    units: number;
    heroes: number;
    bows: number;
    bowLimit: number;
    throwingWeapons: number;
    throwLimit: number;
    might: number;
    will: number;
    fate: number;
    tttSpecialUpgrades?: string[];
    maxPoints?: number;
    siegeRoster: boolean;
    siegeRole?: "Attacker" | "Defender";
  };
};
