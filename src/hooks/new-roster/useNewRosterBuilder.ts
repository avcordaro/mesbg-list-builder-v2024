import { emptyRoster } from "../../state/roster-building/roster";
import { useMandatoryUnits } from "./useMandatoryUnits.ts";
import { useWithSelectedHero } from "./useWithSelectedHero.ts";

type NewRosterArguments = {
  id: string;
  name: string;
  groupId: string;
  armyList: string;
  maximumPoints: number | undefined;
  addUnits: number | undefined;
  addPoints: number | undefined;
  enableSiege: boolean;
  siegeRole: "Attacker" | "Defender" | undefined;
  withHero: string | undefined;
  tags?: string[];
};

export const useNewRosterBuilder = () => {
  const addMandatoryUnits = useMandatoryUnits();
  const addInitialHero = useWithSelectedHero();

  return function makeNewRoster({
    id,
    name,
    groupId,
    armyList,
    maximumPoints,
    addPoints,
    addUnits,
    enableSiege,
    siegeRole,
    withHero,
    tags,
  }: NewRosterArguments) {
    return addInitialHero(
      addMandatoryUnits({
        ...emptyRoster,
        id: id,
        group: groupId,
        name: name,
        armyList: armyList,
        metadata: {
          ...emptyRoster.metadata,
          maxPoints: maximumPoints ? Number(maximumPoints) : undefined,
          siegeRoster: enableSiege,
          addPoints,
          addUnits,
          siegeRole: enableSiege ? siegeRole : undefined,
          tttSpecialUpgrades: armyList === "The Three Trolls" ? [] : undefined,
          tags,
        },
      }),
      withHero,
    );
  };
};
